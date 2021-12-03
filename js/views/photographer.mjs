import View from "./View.mjs";
import { tagFactory } from "../factories/ui.mjs";
import { mediaFactory } from "../factories/ui.mjs";
import { getTemplateElement } from "../utils.mjs";
import { setupDropdown } from "../dropdown.mjs";

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
                const mediaFragment = createMedia(src);
                mediaCard.querySelector('.total-likes').textContent = likes;
                mediaCard.querySelector('.photo-title').textContent = title;
                mediaPlaceholder.append(mediaFragment);
                return mediaCard;
            }
        }

        const currentPhotographerMedia = contentData.media.filter(function (media) {
            return media.photographerId == photographer.id;
        });

        const createMediaCard = mediaCardFactory();
        currentPhotographerMedia.forEach(function (media) {
            const mediaFragment = createMediaCard(
                media.image ?? media.video,
                media.title,
                media.likes,
            );
            const mediaElement = mediaFragment.querySelector('.card-photo');
            // Set data on the card for ordering
            mediaElement.dataset.popularity = media.likes;
            mediaElement.dataset.date = new Date(media.date);
            mediaElement.dataset.dateReverse = new Date(media.date);
            mediaElement.dataset.title = media.title;
            mediaElement.title = `${media.title}\n${media.date}`
            mediaContainer.append(mediaFragment);
        });

        function orderMedia(orderBy = 'popularity') {
            const photographerMedia = Array.from(mediaContainer.children);
            const orderedPhotographerMedia = photographerMedia.sort(function (mediaA, mediaB) {
                let criterionA = null;
                let criterionB = null;
                switch (orderBy) {
                    case 'popularity':
                        // Caution: reverse criteria
                        criterionB = Number(mediaA.dataset[orderBy]);
                        criterionA = Number(mediaB.dataset[orderBy]);
                        break;
                    case 'title':
                        criterionA = mediaA.dataset[orderBy].toLowerCase();
                        criterionB = mediaB.dataset[orderBy].toLowerCase();
                        break;
                    case 'date':
                        criterionA = new Date(mediaA.dataset[orderBy]);
                        criterionB = new Date(mediaB.dataset[orderBy]);
                        break;
                    case 'dateReverse':
                        // Caution: reverse criteria
                        criterionB = new Date(mediaA.dataset[orderBy]);
                        criterionA = new Date(mediaB.dataset[orderBy]);
                        break;
                }
                return criterionA < criterionB;
            });
            orderedPhotographerMedia.forEach(function (media) {
                console.log(media, media.dataset[orderBy]);
                mediaContainer.insertBefore(media, mediaContainer.children[0]);
            });
        }

        setupDropdown(orderMedia);
    }
}
