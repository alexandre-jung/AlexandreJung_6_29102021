import View from "./View.mjs";

export default class Home extends View {

    constructor() {
        super('home');
    }

    render = ({}, contentData) => {

        const filterBy = new URLSearchParams(location.search).get('filter_by');
        const tagSet = new Set();

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

            const tags = p.querySelector('.photographer-tags');
            if (tags) {
                const tagElement = tags.firstElementChild;
                tagElement.remove();
                photographer.tags.forEach(tag => {
                    const newTag = tagElement.cloneNode(true);
                    newTag.href = '/home?filter_by=' + tag;
                    newTag.rel = 'tag';
                    newTag.textContent = '#' + tag;
                    tags.append(newTag);

                });
            }
            photographers.append(p);
        });

        // Find all tags associated to photographers.
        contentData.photographers.forEach(photographer => {
            photographer.tags.forEach(tag => {
                tagSet.add(tag);
            });
        });
        
        const tags = document.querySelector('#tags');
        if (tags) {
            const tagElement = tags.firstElementChild;
            tags.textContent = '';
            tagElement.remove();
            tagSet.forEach(tag => {
                const newTag = tagElement.cloneNode(true);
                const link = newTag.firstElementChild;
                link.href = '/home?filter_by=' + tag;
                link.rel = 'tag';
                link.textContent = '#' + tag;
                tags.append(newTag);
            });
        }
    }
}
