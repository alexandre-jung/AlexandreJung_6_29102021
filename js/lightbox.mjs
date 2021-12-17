import { mediaFactory } from "./factories/ui.mjs";
import { rotateIndex } from "./utils.mjs";

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
    setupEvents() {
        document.addEventListener('keydown', this.hideOnEscapeKey);
        this.closeBtn.addEventListener('click', this.hide);
        this.previousBtn.addEventListener('click', this.previous);
        this.nextBtn.addEventListener('click', this.next);
        document.addEventListener('keydown', ev => {
            if (ev.key == 'ArrowLeft') {
                this.previous(ev);
            } else if (ev.key == 'ArrowRight') {
                this.next(ev);
            }
        })
    }
    setAllMediaSources(allMediaSources) {
        this.allMediaSources = allMediaSources;
    }
    update(currentMediaSource) {
        const currentMediaIdx = this.allMediaSources.indexOf(currentMediaSource);
        const previousMediaSrc = this.allMediaSources[rotateIndex(currentMediaIdx - 1, this.allMediaSources.length - 1)];
        const nextMediaSrc = this.allMediaSources[rotateIndex(currentMediaIdx + 1, this.allMediaSources.length - 1)];

        const mediaElement = this.mediaFactory(currentMediaSource);
        if (mediaElement instanceof HTMLVideoElement) {
            mediaElement.setAttribute('controls', true);
        }
        this.placeholder.textContent = '';
        this.placeholder.append(mediaElement);
        this.previousBtn.dataset.ref = previousMediaSrc;
        this.nextBtn.dataset.ref = nextMediaSrc;
    }
    show = () => {
        this.modal.classList.add('visible');
        this.previousBtn.addEventListener('click', this.previous);
        this.nextBtn.addEventListener('click', this.next);
        window.addEventListener('popstate', this.hide);
    }
    hide = () => {
        this.modal.classList.remove('visible');
        this.previousBtn.removeEventListener('click', this.previous);
        this.nextBtn.removeEventListener('click', this.next);
        window.removeEventListener('popstate', this.hide);
    }
    hideOnEscapeKey = ev => {
        if (ev.key == 'Escape') {
            this.hide();
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
