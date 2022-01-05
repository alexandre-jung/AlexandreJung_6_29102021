import DataFetcher from "../api.mjs";
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
    }

    renderView(params, contentDataFetcher) {

        this.templateDataFetcher.get().then(templateData => {
            this.templateElement = document.createElement('div');
            this.templateElement.innerHTML = templateData;
            this.viewRoot.textContent = '';
            this.viewRoot.appendChild(this.templateElement);
            if (contentDataFetcher) {
                contentDataFetcher.get().then(contentData => {
                    window.scroll(0, 0);
                    this.render(params ?? {}, contentData);
                }).catch(error => {
                    console.error(error);
                    views.notFound.renderView()
                });
            } else {
                views.notFound.render();
            }
        });
    }
}
