import View from "./View.mjs";
import { tagFactory } from "../factories/ui.mjs";
import { mediaFactory } from "../factories/ui.mjs";
import { getTemplateElement } from "../utils.mjs";
import { setupDropdown } from "../dropdown.mjs";
import Lightbox from "../lightbox.mjs";

export default class Photographer extends View {

    constructor() {
        super('photographer');
        this.lightbox = new Lightbox();
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
            return function (src, title, likes, mediaId) {
                const mediaCard = mediaTemplate.cloneNode(true);
                const mediaPlaceholder = mediaCard.querySelector('.media-placeholder');
                const mediaFragment = createMedia(src);
                const likesElement = mediaCard.querySelector('.total-likes')
                likesElement.textContent = likes;
                likesElement.dataset.value = likes;
                likesElement.dataset.mediaId = mediaId;
                mediaCard.querySelector('.photo-title').textContent = title;
                mediaPlaceholder.append(mediaFragment);
                return mediaCard;
            }
        }

        document.addEventListener('click', function (ev) {
            let likeButton = ev.target.closest('.btn.btn-like')
            if (likeButton) {
                const likeValueElement = likeButton.querySelector('.total-likes');
                if (likeValueElement && likeValueElement.dataset.enabled != 'false') {
                    const currentMediaIdx = contentData.media.findIndex(function(media) {
                        return media.id == likeValueElement.dataset.mediaId;
                    });
                    if (currentMediaIdx != -1) {
                        const currentMedia = contentData.media[currentMediaIdx];
                        const currentMediaCanBeLiked = !currentMedia.alreadyLiked;
                        if (currentMediaCanBeLiked) {
                            let totalLikes = +likeValueElement.dataset.value;
                            likeValueElement.dataset.value = ++totalLikes;
                            likeValueElement.textContent = totalLikes;
                            likeValueElement.dataset.enabled = false;
                            currentMedia.likes ++;
                            currentMedia.alreadyLiked = true;
                        }
                    }
                }
            }
        });

        const currentPhotographerMedia = contentData.media.filter(function (media) {
            return media.photographerId == photographer.id;
        });

        const createMediaCard = mediaCardFactory();
        currentPhotographerMedia.forEach(function (media) {
            const mediaFragment = createMediaCard(
                media.image ?? media.video,
                media.title,
                media.likes,
                media.id,
            );
            const mediaElement = mediaFragment.querySelector('.card-photo');
            // Set data on the card for ordering and lightbox
            mediaElement.dataset.popularity = media.likes;
            mediaElement.dataset.date = new Date(media.date);
            mediaElement.dataset.dateReverse = new Date(media.date);
            mediaElement.dataset.title = media.title;
            mediaElement.title = `${media.title}\n${media.date}`;
            mediaContainer.append(mediaFragment);
        });


        const orderMedia = (orderBy = 'popularity') => {
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
            const mediaSources = [];
            orderedPhotographerMedia.forEach(function (media) {
                mediaContainer.insertBefore(media, mediaContainer.children[0]);
                const mediaSrc = media.querySelector('img, video').getAttribute('src');
                mediaSources.unshift(mediaSrc);
            });
            this.lightbox.setAllMediaSources(mediaSources);
            return mediaSources;
        }

        const mediaSources = orderMedia();
        setupDropdown(orderMedia);

        this.lightbox.setAllMediaSources(mediaSources);
        document.querySelectorAll(
            '.media-container img, .media-container video'
        ).forEach(media => {
            media.addEventListener('click', ev => {
                this.lightbox.update(ev.target.dataset.ref);
                this.lightbox.show();
            });
        });
    }
}
