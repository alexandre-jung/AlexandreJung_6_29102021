import View from "./View.mjs";

export default class Photographer extends View {

    constructor() {
        super('photographer');
    }

    render = ({id}) => {
        const photographerId = document.querySelector('#photographer-id');
        photographerId.textContent = id;
    }
}
