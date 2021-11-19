import { DataFetcher } from "../api.mjs";

export default class View {

    constructor(view) {

        if (!view) {
            throw new Error('You must provide a template name');
        }

        const templateURL = `/api/${view}.template.html`;
        this.viewRoot = document.querySelector('#root');
        this.dataFetcher = new DataFetcher(templateURL);
        this.templateElement = null;
    }

    renderView(params) {

        const replaceViewRoot = () => {
            this.viewRoot.textContent = '';
            this.viewRoot.appendChild(this.templateElement);
        }
        
        if (!this.templateElement) {
            this.dataFetcher.get().then(fetchedData => {
                this.templateElement = document.createElement('div');
                this.templateElement.innerHTML = fetchedData;
                replaceViewRoot();
                this.render(params);

            });
        } else {
            replaceViewRoot();
            this.render(params);
        }
    }
}