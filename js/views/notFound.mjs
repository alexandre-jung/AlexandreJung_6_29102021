import View from "./View.mjs";

export default class NotFound extends View {

    constructor() {
        super('notFound');
    }

    render = () => {
        const tabTitle = document.querySelector('title');
        const pageTitle = document.querySelector('#page-title');
        tabTitle.textContent = 'Page introuvable | Fisheye';
        pageTitle.textContent = 'Page introuvable';
        pageTitle.display = 'block';
    }
}
