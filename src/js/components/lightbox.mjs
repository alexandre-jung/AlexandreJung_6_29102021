import { mediaFactory } from "../factories/ui.mjs";
import { rotateIndex } from "../utils.mjs";

export default class Lightbox {
    constructor() {
        this.modal = document.querySelector('.lightbox');
        this.previousBtn = this.modal.querySelector('.btn-previous');
        this.nextBtn = this.modal.querySelector('.btn-next');
        this.closeBtn = this.modal.querySelector('.btn-close');
        this.placeholder = this.modal.querySelector('.lightbox-placeholder');
        this.allMediaSources = null;
        this.mediaFactory = mediaFactory('');
        this.setupEvents();
    }
    /**
     * Add handlers for lightbox buttons.
     */
    setupEvents() {
        this.closeBtn.addEventListener('click', this.hide);
        this.previousBtn.addEventListener('click', this.previous);
        this.nextBtn.addEventListener('click', this.next);
    }
    /**
     * Add handlers for document and window events.
     */
    destroyGlobalEvents() {
        window.removeEventListener('popstate', this.hide);
        document.removeEventListener('keydown', this.hideOnEscapeKey);
        document.removeEventListener('keydown', this.handleArrowKeys);
    }
    /**
     * Remove handlers for document and window events.
     */
    setupGlobalEvents() {
        window.addEventListener('popstate', this.hide);
        document.addEventListener('keydown', this.hideOnEscapeKey);
        document.addEventListener('keydown', this.handleArrowKeys);
    }
    setAllMediaSources(allMediaSources) {
        this.allMediaSources = allMediaSources.map(media => media.src);
        this.allMediaTitles = allMediaSources.map(media => media.title);
    }
    update(currentMediaSource) {
        const currentMediaIdx = this.allMediaSources.indexOf(currentMediaSource);
        const previousMediaSrc = this.allMediaSources[rotateIndex(currentMediaIdx - 1, this.allMediaSources.length - 1)];
        const nextMediaSrc = this.allMediaSources[rotateIndex(currentMediaIdx + 1, this.allMediaSources.length - 1)];
        const currentMediaTitle = this.allMediaTitles[currentMediaIdx];

        function getTitleElement() {
            const titleElement = document.createElement('h2');
            titleElement.textContent = currentMediaTitle;
            titleElement.classList.add('lightbox-title');
            return titleElement;
        }

        const mediaElement = this.mediaFactory(currentMediaSource);
        if (mediaElement instanceof HTMLVideoElement) {
            mediaElement.setAttribute('controls', true);
        }
        this.placeholder.textContent = '';
        this.placeholder.append(mediaElement);
        this.placeholder.append(getTitleElement());
        this.previousBtn.dataset.ref = previousMediaSrc;
        this.nextBtn.dataset.ref = nextMediaSrc;
    }
    show = () => {
        this.modal.classList.add('visible');
        document.body.style.overflowY = 'hidden';
        this.setupGlobalEvents();
    }
    hide = () => {
        this.modal.classList.remove('visible');
        document.body.style.overflowY = 'auto';
        this.destroyGlobalEvents();
    }
    hideOnEscapeKey = ev => {
        if (ev.key == 'Escape') {
            this.hide();
        }
    }
    handleArrowKeys = ev => {
        if (ev.key == 'ArrowLeft') {
            this.previous(ev);
        } else if (ev.key == 'ArrowRight') {
            this.next(ev);
        }
    }
    previous = ev => {
        const target = ev.target.closest('.lightbox-btn');
        this.update((target ? target : this.previousBtn).dataset.ref);
    }
    next = ev => {
        const target = ev.target.closest('.lightbox-btn');
        this.update((target ? target : this.nextBtn).dataset.ref);
    }
}
