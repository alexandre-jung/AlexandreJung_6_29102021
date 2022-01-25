import View from "./View.mjs";
import { getAllTags } from "../api.mjs";
import { generateThumbnailFilename } from "../utils.mjs";
import Template from "../template.mjs";

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

        let photographersFilteredData = contentData.photographers;
        if (filterBy) {
            photographersFilteredData = photographersFilteredData.filter(photographer =>
                photographer.tags.includes(filterBy)
            );
        }

        Home.renderTags(
            document.querySelector("#tags"),
            getAllTags(contentData),
            filterBy,
            true
        );
        Home.renderPhotographers(photographersFilteredData);
        document.querySelector('#tag-template')?.remove();

        if(location.hash == '#root') {
            setTimeout(() =>
                document.querySelector('.card-photographer .image-link')?.focus(), 0
            );
        } else {
            const activeTag = document.querySelector('.btn-tag.active');
            if (activeTag) {
                activeTag.focus();
                activeTag.blur();
            } else {
                document.body.focus();
            }
        }
    }

    static renderPhotographers(photographers) {
        // Get template element and placeholder for photographers.
        const photographerTemplate = document.querySelector('#photographer-template');
        const placeholder = document.querySelector('#photographers');

        const template = new Template(photographerTemplate.content);

        // Display every filtered photographer.
        photographers.forEach(photographer => {

            // Render a new DOM element that we can insert,
            // and get useful handles on elements inside it.
            const [newElement, { link, tagList }] = template.render({
                ...photographer,
                href: `${import.meta.env.BASE_URL}photographer/` + photographer.id,
                thumbnail: generateThumbnailFilename(`${import.meta.env.BASE_URL}media/` + photographer.portrait),
                descriptionId: `photographer-description-${photographer.id}`,
            });

            // Keep the focusable element centered if possible.
            link.addEventListener('focus', () =>
                link.scrollIntoView({ block: 'center', behavior: 'smooth' })
            );

            // Add photographer's tags.
            Home.renderTags(tagList, photographer.tags);

            // Add photographer
            placeholder.append(newElement);
        });
        // Get rid of the template element (mainly for W3C validation).
        // It is created again on page rendering anyway.
        photographerTemplate.remove();
    }
}
