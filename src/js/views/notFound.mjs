import View from "./View.mjs";

export default class NotFound extends View {

    constructor() {
        super('notFound');
    }

    render = () => {
        const tabTitle = document.querySelector('title');
        const h1 = document.querySelector('#page-title');
        tabTitle.textContent = 'Page introuvable | Fisheye';
        h1.textContent = 'Page introuvable';
        h1.style.display = 'block';
        h1.setAttribute('aria-hidden', false);
    }
}
