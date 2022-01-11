import View from "./View.mjs";
import { tagFactory } from "../factories/ui.mjs";
import { mediaFactory } from "../factories/ui.mjs";
import { getTemplateElement } from "../utils.mjs";
import { setupDropdown } from "../dropdown.mjs";
import Lightbox from "../lightbox.mjs";
import { showModal } from '../modal.mjs';
import NotFoundError from "../exceptions/NotFound.mjs";

export default class Photographer extends View {

    constructor() {
        super('photographer');
        this.lightbox = new Lightbox();
    }

    render = ({ id }, contentData) => {
        // Get data for the current photographer
        const photographerIdx = contentData.photographers.findIndex(function (photographer) {
            return photographer.id == id;
        });
        if (photographerIdx == -1) {
            throw new NotFoundError('Photographer not found');
        }
        
        // Hide home header elements except the logo
        const tagNav = document.querySelector('nav');
        const pageTitle = document.querySelector('#page-title');
        tagNav.style.display = 'none';
        pageTitle.style.display = 'none';

        // Show orderBy dropdown
        const orderBy = document.querySelector('#orderby');
        orderBy.style.display = 'inline-flex';

        const photographer = contentData.photographers[photographerIdx];

        // Set document and page titles
        const tabTitle = document.querySelector('title');
        const photographerNameTitle = document.querySelector('#photographer-name-title');
        tabTitle.textContent = `${photographer.name} | Fisheye`;
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

        function mediaCardFactory() {
            const createMedia = mediaFactory();
            const mediaTemplate = getTemplateElement('media-card');
            return function (src, title, likes, mediaId, disabled) {
                const mediaCard = mediaTemplate.cloneNode(true);
                const mediaPlaceholder = mediaCard.querySelector('.media-placeholder');
                const mediaFragment = createMedia(src, title);
                const likesElement = mediaCard.querySelector('.total-likes')
                likesElement.textContent = likes;
                likesElement.dataset.value = likes;
                likesElement.dataset.mediaId = mediaId;
                if (disabled) {
                    let likeButton = likesElement.closest('.btn.btn-like');
                    likeButton.disabled = true;
                }
                mediaCard.querySelector('.photo-title').textContent = title;
                mediaPlaceholder.append(mediaFragment);
                return mediaCard;
            }
        }

        const currentPhotographerMedia = contentData.media.filter(function (media) {
            return media.photographerId == photographer.id;
        });
        let photographerLikes = currentPhotographerMedia.reduce(
            (previous, current) => previous + current.likes, 0
         );

        function handleLikeClick(ev) {
            let likeButton = ev.target.closest('.btn.btn-like');
            if (likeButton) {
                const likeValueElement = likeButton.querySelector('.total-likes');
                if (likeValueElement && !likeButton.disabled) {
                    const currentMediaIdx = contentData.media.findIndex(function (media) {
                        return media.id == likeValueElement.dataset.mediaId;
                    });
                    if (currentMediaIdx != -1) {
                        const currentMedia = contentData.media[currentMediaIdx];
                        const currentMediaCanBeLiked = !currentMedia.alreadyLiked;
                        if (currentMediaCanBeLiked) {
                            let totalLikes = +likeValueElement.dataset.value;
                            likeValueElement.dataset.value = ++totalLikes;
                            likeValueElement.textContent = totalLikes;
                            likeButton.disabled = true;
                            likeButton.blur();
                            currentMedia.likes++;
                            currentMedia.alreadyLiked = true;

                            // Update insert likes data-popularity of the media element for further ordering
                            likeButton.closest('[data-popularity]').dataset.popularity++;
                            document.querySelector('.insert-likes-value').textContent = ++photographerLikes;
                        }
                    }
                }
            }
        }
        document.addEventListener('click', handleLikeClick);

        const createMediaCard = mediaCardFactory();
        const mediaRoot = document.querySelector('#media-root');
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('grid');
        currentPhotographerMedia.forEach(function (media) {
            const mediaFragment = createMediaCard(
                media.image ?? media.video,
                media.title,
                media.likes,
                media.id,
                media.alreadyLiked,
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
        mediaRoot.append(mediaContainer);


        const orderMedia = (orderBy = 'popularity') => {
            const photographerMedia = Array.from(mediaContainer.children);
            const orderedPhotographerMedia = photographerMedia.sort(function (mediaA, mediaB) {
                let criterionA = mediaA.dataset[orderBy].toLowerCase();
                let criterionB = mediaB.dataset[orderBy].toLowerCase();
                switch (orderBy) {
                    case 'popularity':
                        // Caution: reverse criteria
                        [criterionB, criterionA] = [Number(criterionA), Number(criterionB)];
                        break;
                    case 'date':
                        [criterionA, criterionB] = [new Date(criterionA), new Date(criterionB)];
                        break;
                    case 'dateReverse':
                        // Caution: reverse criteria
                        [criterionB, criterionA] = [new Date(criterionA), new Date(criterionB)];
                        break;
                    default:
                }
                if (criterionA == criterionB) return 0;
                return criterionA < criterionB ? 1 : -1;
            });
            const mediaSources = [];
            orderedPhotographerMedia.forEach(function (media) {
                mediaContainer.insertBefore(media, mediaContainer.children[0]);
                let mediaElement = media.querySelector('img, video');
                const mediaSrc = mediaElement.getAttribute('src');
                const mediaTitle = mediaElement.dataset.title;
                mediaSources.unshift({ src: mediaSrc, title: mediaTitle });
            });
            this.lightbox.setAllMediaSources(mediaSources);
            return mediaSources;
        }

        const mediaSources = orderMedia();
        setupDropdown(orderMedia);

        this.lightbox.setAllMediaSources(mediaSources);
        document.querySelectorAll(
            '#media-root img, #media-root video'
        ).forEach(media => {
            media.addEventListener('click', ev => {
                console.log('clicked media');
                this.lightbox.update(ev.target.dataset.ref);
                this.lightbox.show();
            });
        });


        // Setup the information insert
        const insertTemplate = getTemplateElement('insert');
        const insertPlaceholder = document.getElementById('insert');
        insertPlaceholder.appendChild(insertTemplate.cloneNode(true));
        const insertElement = insertPlaceholder.querySelector('.insert');
        insertElement.querySelector('.insert-likes-value').textContent = photographerLikes;
        insertElement.querySelector('.insert-daily-charge').textContent = photographer.price;
        // Setup the heart icon
        // FIXME It cannot be placed directly in the insert template
        const heartTemplate = getTemplateElement('heart-icon');
        insertElement.querySelector('.insert-likes').appendChild(heartTemplate.cloneNode(true))

        // Setup contact modal
        const contactBtn = document.querySelector('.contact');
        const modalPhotographerName = document.querySelector('#photographer-name');
        contactBtn.addEventListener('click', showModal);
        modalPhotographerName.textContent = photographer.name;

        return function() {
            document.removeEventListener('click', handleLikeClick);
        }
    }
}
