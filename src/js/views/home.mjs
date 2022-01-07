import View from "./View.mjs";
import { getAllTags } from "../api.mjs";
import { tagFactory } from "../factories/ui.mjs";

export default class Home extends View {

    constructor() {
        super('home');
    }

    render = (_, contentData) => {
        // Hide home header elements except the logo
        const tagNav = document.querySelector('nav');
        const pageTitle = document.querySelector('#page-title');
        tagNav.style.display = 'block';
        pageTitle.textContent = 'Nos photographes';
        pageTitle.style.display = 'block';

        const tabTitle = document.querySelector('title');
        tabTitle.textContent = 'Accueil | Fisheye';

        const filterBy = (new URLSearchParams(location.search)).get('filter_by');

        let filteredData = contentData.photographers;
        if (filterBy) {
            filteredData = filteredData.filter(photographer => {
                if (photographer.tags.includes(filterBy)) {
                    return true;
                }
            });
        }

        const photographerTemplate = this.templateElement.querySelector('#photographer-template');
        const photographers = document.querySelector('#photographers');

        // Display every filtered photographer.
        filteredData.forEach(photographer => {
            const p = photographerTemplate.content.cloneNode(true);
            p.querySelector('.photographer-name').textContent = photographer.name;
            p.querySelector('.photographer-portrait').src = '/media/' + photographer.portrait;
            p.querySelector('.photographer-city').textContent = photographer.city;
            p.querySelector('.photographer-tagline').textContent = photographer.tagline;
            p.querySelector('.photographer-price').textContent = photographer.price;
            p.querySelector('.image-link').href = '/photographer/' + photographer.id;

            const tags = p.querySelector('.tag-list');
            if (tags) {
                const createTag = tagFactory();
                photographer.tags.forEach(tagLabel => {
                    tags.append(createTag(tagLabel));
                });
            }

            photographers.append(p);
        });

        const tags = document.querySelector('#tags');
        if (tags) {
            tags.textContent = '';
            const createTag = tagFactory(true);
            getAllTags(contentData).forEach(tagLabel => {
                tags.append(createTag(tagLabel, tagLabel == filterBy));
            });
        }
    }
}
