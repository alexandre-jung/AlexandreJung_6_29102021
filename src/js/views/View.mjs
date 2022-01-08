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

        this.templateDataFetcher.get().then(templateData => {
            this.templateElement = document.createElement('div');
            this.templateElement.innerHTML = templateData;
            this.viewRoot.textContent = '';
            this.viewRoot.appendChild(this.templateElement);
            if (contentDataFetcher) {
                contentDataFetcher.get().then(
                    contentData => {
                        // Data successfully fetched
                        window.scroll(0, 0);
                        if (this.cleanUp) {
                            this.cleanUp();
                            this.cleanUp = null;
                        }
                        try {
                            this.cleanUp = this.render(params ?? {}, contentData);
                        } catch(error) {
                            // Error during render
                            if (error instanceof NotFoundError) {
                                views.notFound.renderView(null, contentDataFetcher)
                            } else {
                                displayError(error);
                            }
                        }
                    // Error while fetching pplication data
                    }, displayError
                );
            }
        // Error while fetching template data
        }).catch(displayError);
    }
}
