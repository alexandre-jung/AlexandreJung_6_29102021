import View from "./View.mjs";

export default class Home extends View {

    constructor() {
        super('photographer');
    }

    render = ({id}) => {
        const photographerId = document.querySelector('#photographer-id');
        photographerId.textContent = id;
    }
}
