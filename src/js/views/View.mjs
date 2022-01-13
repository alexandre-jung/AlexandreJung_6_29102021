import DataFetcher from "../api.mjs";
import NotFoundError from "../exceptions/NotFound.mjs";
import views from "./index.mjs";

export default class View {

    constructor(view) {

        if (!view) {
            throw new Error('You must provide a template name');
        }

        this.viewName = view;
        this.templateURL = `/api/${view}.template.html`;
        this.viewRoot = document.querySelector('#root');
        this.templateDataFetcher = new DataFetcher(this.templateURL);
        this.templateElement = null;
        this.cleanUp = null;
    }

    renderView(params, contentDataFetcher) {
        
        function displayError(error, message = 'An error occured.') {
            document.body.innerHTML = `${message}<br>Details:<br>`;
            document.body.append(error);
        }

        const fetchData = async () => {
            const applicationData = await contentDataFetcher.get();
            const templateData = await this.templateDataFetcher.get();
            return {applicationData, templateData};
        };

        fetchData().then(({applicationData, templateData}) => {

            // Display the template
            this.templateElement = document.createElement('div');
            this.templateElement.innerHTML = templateData;
            this.viewRoot.textContent = '';
            this.viewRoot.appendChild(this.templateElement);
            window.scroll(0, 0);

            // Run the cleaning function
            if (this.cleanUp) {
                this.cleanUp();
                this.cleanUp = null;
            }

            try {
                // Render the view
                this.cleanUp = this.render(params ?? {}, applicationData);
            } catch(error) {
                // Error during render
                if (error instanceof NotFoundError) {
                    views.notFound.renderView(null, contentDataFetcher)
                } else {
                    displayError(error);
                }
            }
        // Error while fetching data
        }).catch(displayError);
    }
}
