import BaseView from "@/views/BaseView";
import Photographer from "@/views/photographer.mjs";
import { getAllTags } from "@/api";
import { generateThumbnailFilename, wrapElement } from "@/utils";
import Template from "@/template";
import { tagFactory } from "@/factories";

export default class Home extends BaseView {

    constructor() {
        super('home');
    }

    render = (_, contentData) => {
        // Hide home header elements except the logo
        const tagNav = document.querySelector('nav');
        const h1 = document.querySelector('#page-title');
        tagNav.style.display = 'block';
        h1.textContent = 'Nos photographes';
        h1.style.display = 'block';
        h1.setAttribute('aria-hidden', false);

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

            link.addEventListener('mousedown', () =>
                link.dataset.clicked = true
            );

            // Keep the focusable element centered if possible.
            link.addEventListener('focus', () => {
                if (link.dataset.clicked == 'true') {
                    link.dataset.clicked = false;
                    return;
                }
                link.classList.add('focused');
                link.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });

            link.addEventListener('blur', () => {
                link.classList.remove('focused');
            });

            // Add photographer's tags.
            Photographer.renderTags(tagList, photographer.tags);

            // Add photographer
            placeholder.append(newElement);
        });
        // Get rid of the template element (mainly for W3C validation).
        // It is created again on page rendering anyway.
        photographerTemplate.remove();
    }

    static renderTags(placeholder, tags, activeTag, tabFocusable = false) {
        if (placeholder) {
            placeholder.textContent = '';
            const createTag = tagFactory(tabFocusable);
            tags.forEach(tagLabel => {
                const newTag = createTag(tagLabel, tagLabel == activeTag);
                placeholder.append(wrapElement(newTag, 'li'));
            });
        }
    }
}
