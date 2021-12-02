import View from "./View.mjs";
import { tagFactory } from "../factories/ui.mjs";
import { mediaFactory } from "../factories/ui.mjs";
import { getTemplateElement } from "../utils.mjs";

export default class Photographer extends View {

    constructor() {
        super('photographer');
    }

    render = ({ id }, contentData) => {
        // Hide home header elements except the logo
        const tagNav = document.querySelector('nav');
        const homeTitle = document.querySelector('#page-title');
        tagNav.style.display = 'none';
        homeTitle.style.display = 'none';

        // Get data for the current photographer
        const photographerIdx = contentData.photographers.findIndex(function (photographer) {
            return photographer.id == id;
        });
        const photographer = contentData.photographers[photographerIdx];

        // Set document and page titles
        const pageTitle = document.querySelector('title');
        const photographerNameTitle = document.querySelector('#photographer-name-title');
        pageTitle.textContent = photographer.name;
        photographerNameTitle.textContent = photographer.name;

        // Set photographer informations
        const heroSection = document.querySelector('.hero');
        const photographerCity = heroSection.querySelector('.city');
        const photographerCountry = heroSection.querySelector('.country');
        const photographerTagline = heroSection.querySelector('.tagline');
        const photographerTags = heroSection.querySelector('.tag-list');
        const photographerProfilePhoto = heroSection.querySelector('.profile-image');
        photographerCity.textContent = photographer.city;
        photographerCountry.textContent = photographer.country;
        photographerTagline.textContent = photographer.tagline;
        photographerProfilePhoto.setAttribute('src', `/media/${photographer.portrait}`);

        if (photographerTags) {
            const createTag = tagFactory();
            photographer.tags.forEach(tagLabel => {
                photographerTags.append(createTag(tagLabel));
            });
        }

        const mediaContainer = document.querySelector('.media-container');

        function mediaCardFactory() {
            const createMedia = mediaFactory();
            const mediaTemplate = getTemplateElement('media-card');
            return function (src, title, likes) {
                const mediaCard = mediaTemplate.cloneNode(true);
                const mediaPlaceholder = mediaCard.querySelector('.media-placeholder');
                const mediaElement = createMedia(src);
                mediaCard.querySelector('.total-likes').textContent = likes;
                mediaCard.querySelector('.photo-title').textContent = title;
                mediaPlaceholder.append(mediaElement);
                return mediaCard;
            }
        }

        const createMediaCard = mediaCardFactory();
        contentData.media.forEach(function (media) {
            if (media.photographerId == photographer.id) {
                const mediaElement = createMediaCard(
                    media.image ?? media.video,
                    media.title,
                    media.likes,
                );
                mediaContainer.append(mediaElement);
            }
        });
    }
}
