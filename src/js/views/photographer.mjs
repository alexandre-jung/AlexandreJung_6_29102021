import View from "./View.mjs";
import { mediaCardFactory } from "../factories/ui.mjs";
import { setupDropdown } from "../components/dropdown.mjs";
import Lightbox from "../components/lightbox.mjs";
import { showModal } from '../components/modal.mjs';
import NotFoundError from "../exceptions/NotFound.mjs";
import { tagFactory } from "../factories/ui.mjs";
import { generateThumbnailFilename } from "../utils.mjs";

export default class Photographer extends View {

    constructor() {
        super('photographer');
        this.lightbox = null;
    }

    render = ({ id }, contentData) => {
        if (!this.lightbox) {
            this.lightbox = new Lightbox();
        }

        // Get data for the current photographer
        const photographerIdx = contentData.photographers.findIndex(function (photographer) {
            return photographer.id == id;
        });
        if (photographerIdx == -1) {
            throw new NotFoundError('Photographer not found');
        }
        
        // Hide home header elements except the logo
        const tagNav = document.querySelector('nav');
        tagNav.style.display = 'none';

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
        photographerProfilePhoto.setAttribute('src', generateThumbnailFilename(`${import.meta.env.BASE_URL}media/${photographer.portrait}`));
        photographerProfilePhoto.alt = photographer.name;

        Photographer.renderTags(photographerTags, photographer.tags);

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
                            document.querySelector('#insert-likes-value').textContent = ++photographerLikes;
                        }
                    }
                }
            }
        }
        document.addEventListener('click', handleLikeClick);

        const createMediaCard = mediaCardFactory(true);
        const mediaRoot = document.querySelector('#media-root');
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('grid');

        currentPhotographerMedia.forEach(function (media) {
            const mediaFragment = createMediaCard(
                media.image ?? media.video,
                media.title,
                media.likes,
                media.id,
                media.date,
                media.alreadyLiked,
            );
            const mediaElement = mediaFragment.querySelector('.card-photo');
            mediaContainer.append(mediaFragment);

            // Prevent auto-scroll if clicked
            mediaElement.querySelector('img, video').addEventListener('mousedown', ev =>
                ev.target.dataset.clicked = true
            );
            mediaElement.querySelector('img, video').addEventListener('focus', ({target}) => {
                if (target.dataset.clicked == 'true') {
                    target.dataset.clicked = false;
                    return;
                }
                const placeholder = target.closest('.media-placeholder');
                placeholder.classList.add('outline-primary');
                target.addEventListener('blur', () => placeholder.classList.remove('outline-primary'));
                target.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
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
                const mediaSrc = mediaElement.dataset.ref;
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
            const handleShowModal = ev => {
                if (ev.type == 'click' || ev.type == 'keydown' && ev.key == 'Enter') {
                    this.lightbox.update(ev.target.dataset.ref);
                    this.lightbox.show(ev);
                    ev.preventDefault();
                }
            }
            media.addEventListener('click', handleShowModal);
            media.addEventListener('keydown', handleShowModal);
        });


        // Setup the information insert
        document.querySelector('#insert-likes-value').textContent = photographerLikes;
        document.querySelector('#insert-daily-charge').textContent = photographer.price;

        // Setup contact modal
        const contactBtn = document.querySelector('.contact');
        const modalPhotographerName = document.querySelector('#contact-photographer-name');
        function handleModalHide() {
            contactBtn.focus();
        }
        contactBtn.addEventListener('click', () => showModal(handleModalHide));
        modalPhotographerName.textContent = photographer.name;

        if (location.hash == '#root')
            history.pushState(null, null, location.pathname + '#media-root');
        document.body.focus();
        if (location.hash == '#media-root') {
            // Delay for Chrome as the focus isn't set if called to quickly after the previous one.
            setTimeout(() =>
                document.querySelector(
                    '.media-placeholder video, .media-placeholder img'
                )?.focus(), 0
            );
        }

        return function() {
            document.removeEventListener('click', handleLikeClick);
        }
    }

    static renderTags(placeholder, tags, activeTag, tabFocusable = false) {
        if (placeholder) {
            placeholder.textContent = '';
            const createTag = tagFactory(tabFocusable);
            tags.forEach(tagLabel => {
                placeholder.append(createTag(tagLabel, tagLabel == activeTag));
            });
        }
    }
}
