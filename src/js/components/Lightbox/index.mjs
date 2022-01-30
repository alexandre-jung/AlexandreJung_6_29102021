import { mediaFactory } from "@/factories";
import { generateFilename, rotateIndex } from "@/utils";

export default class Lightbox {
    constructor() {
        this.modal = document.querySelector('.lightbox');
        this.previousBtn = this.modal.querySelector('.btn-previous');
        this.nextBtn = this.modal.querySelector('.btn-next');
        this.closeBtn = this.modal.querySelector('.btn-close');
        this.placeholder = this.modal.querySelector('.lightbox-placeholder');
        this.allMediaSources = null;
        this.mediaFactory = mediaFactory('');
        this.previousFocus = null;
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
     * Called when showing modal.
     */
    setupGlobalEvents() {
        window.addEventListener('popstate', this.hide);
        document.addEventListener('keydown', this.hideOnEscapeKey);
        document.addEventListener('keydown', this.handleArrowKeys);
        document.addEventListener('keydown', this.trapFocusWithin);
    }
    /**
     * Remove handlers for document and window events.
     * Called when hiding modal.
     */
    destroyGlobalEvents() {
        window.removeEventListener('popstate', this.hide);
        document.removeEventListener('keydown', this.hideOnEscapeKey);
        document.removeEventListener('keydown', this.handleArrowKeys);
        this.releaseFocus();
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
        this.currentMediaSource = currentMediaSource;

        function getTitleElement() {
            const titleElement = document.createElement('h2');
            titleElement.textContent = currentMediaTitle;
            titleElement.classList.add('lightbox-title');
            return titleElement;
        }

        const mediaElement = this.mediaFactory(
            generateFilename(currentMediaSource),
            currentMediaTitle,
            true
        );
        this.placeholder.textContent = '';
        this.placeholder.append(mediaElement);
        this.placeholder.append(getTitleElement());
        this.previousBtn.dataset.ref = previousMediaSrc;
        this.nextBtn.dataset.ref = nextMediaSrc;
    }
    show = () => {
        this.previousFocus = document.activeElement;
        this.modal.classList.add('visible');
        document.body.style.overflowY = 'hidden';
        this.setupGlobalEvents();
        this.closeBtn.focus();
    }
    hide = () => {
        this.modal.classList.remove('visible');
        document.body.style.overflowY = 'auto';
        this.destroyGlobalEvents();
        if (this.previousFocus) {
            this.previousFocus.scrollIntoView({ block: 'center', behavior: 'smooth' });
            this.previousFocus.focus({ preventScroll: true });
            this.previousFocus = null;
        }
    }
    hideOnEscapeKey = ev => {
        if (ev.key == 'Escape') {
            this.hide();
        }
    }
    handleArrowKeys = ev => {
        if (ev.target.nodeName == 'VIDEO')
            return;
        if (ev.key == 'ArrowLeft') {
            this.previous(ev);
        } else if (ev.key == 'ArrowRight') {
            this.next(ev);
        }
    }
    previous = () => {
        this.update(this.previousBtn.dataset.ref);
        this.previousFocus = document.querySelector(`[src="${this.currentMediaSource}"]`);
    }
    next = () => {
        this.update(this.nextBtn.dataset.ref);
        this.previousFocus = document.querySelector(`[src="${this.currentMediaSource}"]`);
    }
    trapFocusWithin = ev => {
        if (ev.key == 'Tab') {
            if (ev.target === this.nextBtn && !ev.getModifierState('Shift')) {
                ev.preventDefault();
                this.closeBtn.focus();
            } else if (ev.target === this.closeBtn && ev.getModifierState('Shift')) {
                ev.preventDefault();
                this.nextBtn.focus();
            }
        }
    }
    releaseFocus = () => {
        document.removeEventListener('keydown', this.trapFocusWithin);
    }
}
