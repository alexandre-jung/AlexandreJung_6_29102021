import DataFetcher from "../api.mjs";
import NotFoundError from "../exceptions/NotFound.mjs";
import views from "./index.mjs";
import { tagFactory } from "../factories/ui.mjs";

export default class View {

    constructor(view) {

        if (!view) {
            throw new Error('You must provide a template name');
        }

        this.viewName = view;
        this.templateURL = `${import.meta.env.BASE_URL}api/${view}.template.html`;
        this.sharedTemplatesURL = `${import.meta.env.BASE_URL}api/shared.template.html`;
        this.viewRoot = document.querySelector('#root');
        this.templateDataFetcher = new DataFetcher(this.templateURL);
        this.sharedTemplatesFetcher = new DataFetcher(this.sharedTemplatesURL);
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
            const sharedTemplatesData = await this.sharedTemplatesFetcher.get();
            return {
                applicationData,
                templateData,
                sharedTemplatesData
            };
        };

        fetchData().then(({
            applicationData,
            templateData,
            sharedTemplatesData
        }) => {

            const sharedTemplates = document.createElement('div');
            sharedTemplates.innerHTML = sharedTemplatesData;

            // Display the template
            this.templateElement = document.createElement('div');
            this.templateElement.innerHTML = templateData;
            this.viewRoot.textContent = '';
            this.viewRoot.appendChild(this.templateElement);
            for (const template of Array.from(sharedTemplates.children)) {
                document.body.append(template);
            }
            window.scroll(0, 0);

            // Run the cleaning function
            if (this.cleanUp) {
                this.cleanUp();
                this.cleanUp = null;
            }

            try {
                // Render the view
                this.cleanUp = this.render(params ?? {}, applicationData);
                window.scrollTo(0, 0);
            } catch(error) {
                // Error during render
                if (error instanceof NotFoundError) {
                    views.notFound.renderView(null, contentDataFetcher);
                } else {
                    displayError(error);
                }
            }
            
            // Remove the templates
            document.querySelector('#tag-template')?.remove();
            document.querySelector('#img-template')?.remove();
            document.querySelector('#video-template')?.remove();

        // Error while fetching data
        }).catch(displayError);
    }

    static renderTags(placeholder, tags, activeTag, tabFocusable = false) {
        if (placeholder) {
            placeholder.textContent = '';
            const createTag = tagFactory(tabFocusable);
            tags.forEach(tagLabel => {
                placeholder.append(createTag(tagLabel, tagLabel == activeTag));
            });
        }
    }
}
