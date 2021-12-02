export function tagFactory(tabFocusable = false) {
    const tagTemplate = document.createElement('a');
    tagTemplate.classList.add('btn', 'btn-tag');
    tagTemplate.tabIndex = +tabFocusable - 1;
    tagTemplate.rel = 'tag';
    return function (tagLabel) {
        const tag = tagTemplate.cloneNode();
        tag.href = '/home?filter_by=' + tagLabel;
        tag.textContent = `#${tagLabel}`;
        return tag;
    }
}

export function imageFactory() {
    const imageTemplate = document.createElement('img');
    imageTemplate.style.width = '100%';
    return function (src) {
        const image = imageTemplate.cloneNode(false);
        image.src = src;
        return image;
    }
}

export function videoFactory() {
    const videoTemplate = document.createElement('video');
    videoTemplate.style.width = '100%';
    videoTemplate.setAttribute('controls', '');
    return function (src) {
        const video = videoTemplate.cloneNode(false);
        video.src = src;
        return video;
    }
}

export function mediaFactory() {
    const createImage = imageFactory();
    const createVideo = videoFactory();
    return function (src) {
        if (src.endsWith('.jpg')) {
            return createImage(`/media/${src}`);
        } else if (src.endsWith('.mp4')) {
            return createVideo(`/media/${src}`);
        }
    }
}
