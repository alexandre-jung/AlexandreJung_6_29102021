import Template from "../template.mjs";
import {
    generateThumbnailFilename,
    getTemplateElement
} from "../utils.mjs";

export function tagFactory(tabFocusable = false) {
    const template = new Template(
        document.querySelector('#tag-template').content
    );
    return (label, active = false) => {
        const [rendered, { tag }] = template.render({
            label: `#${label}`,
            href: `${import.meta.env.BASE_URL}home?filter_by=${label}`,
            tabindex: tabFocusable ? 0 : -1,
        });
        if (active) tag.classList.add('active');
        return rendered;
    };
}

export function imageFactory() {

    const templateElement = document.querySelector('#img-template')?.content;
    if (!templateElement) throw new Error('<img> template not found in the document');
    const template = new Template(templateElement);
    return (src, title) => {
        const [rendered, { img }] = template.render({
            src,
            title,
            tabindex: 0,
        });
        img.alt = title;
        return rendered;
    };
}

export function videoFactory() {

    const template = new Template(
        document.querySelector('#video-template').content
    );
    return (src, title, allowControls = false) => {
        const [rendered, { video }] = template.render({
            src,
            title,
            tabindex: 0,
        });
        if (allowControls) {
            video.setAttribute('controls', true);
        }
        return rendered;
    };
}

export function mediaFactory(base = `${import.meta.env.BASE_URL}/media/`, useThumbnail = false) {
    const createImage = imageFactory();
    const createVideo = videoFactory();
    return function (source, title, allowControls = false) {
        if (source) {
            let mediaElement = null;
            if (source.endsWith('.jpg')) {
                const file = useThumbnail ? generateThumbnailFilename(source) : source;
                mediaElement = createImage(`${base}${file}`, title);
            } else if (source.endsWith('.mp4')) {
                mediaElement = createVideo(`${base}${source}`, title, allowControls);
            } else {
                console.error('unknown media format');
                return;
            }
            return mediaElement;
        } else {
            console.error('param source is undefined');
        }
    }
}

export function mediaCardFactory(removeTemplateElement = false) {
    const createMedia = mediaFactory(`${import.meta.env.BASE_URL}media/`, true);
    const templateElement = document.querySelector('#media-card-template');
    const template = new Template(templateElement.content);

    if (removeTemplateElement) {
        templateElement.remove();
    }

    return (src, title, nbLikes, mediaId, date, disabled) => {
        const mediaFragment = createMedia(src, title);
        const [rendered, { likeButton, mediaPlaceholder }] = template.render({
            nbLikes,
            mediaId,
            title,
            likeAriaLabel: `${nbLikes} likes`,
            date: new Date(date),
            dateReverse: new Date(date),
            tooltip: `${title}\n${date}`,
        });
        likeButton.disabled = disabled;
        mediaPlaceholder.append(mediaFragment);
        
        // Refocus media when liking it
        likeButton.addEventListener('click', function refocusMedia() {
            mediaPlaceholder.firstElementChild.focus();
            likeButton.removeEventListener('click', refocusMedia);
        });

        return rendered;
    };
}
