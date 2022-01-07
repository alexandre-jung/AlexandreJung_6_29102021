export function tagFactory(tabFocusable = false) {
    const tagTemplate = document.createElement('a');
    tagTemplate.classList.add('btn', 'btn-tag');
    tagTemplate.tabIndex = +tabFocusable - 1;
    tagTemplate.rel = 'tag';
    return function (tagLabel, active = false) {
        const tag = tagTemplate.cloneNode();
        tag.href = '/home?filter_by=' + tagLabel;
        tag.textContent = `#${tagLabel}`;
        if (active) {
            tag.classList.add('active');
        }
        return tag;
    }
}

export function imageFactory() {
    const imageTemplate = document.createElement('img');
    imageTemplate.style.width = '100%';
    return function (src) {
        const image = imageTemplate.cloneNode(false);
        image.src = src;
        image.dataset.ref = src;
        return image;
    }
}

export function videoFactory() {
    const videoTemplate = document.createElement('video');
    videoTemplate.style.width = '100%';
    return function (src) {
        const video = videoTemplate.cloneNode(false);
        video.src = src;
        video.dataset.ref = src;
        return video;
    }
}

export function mediaFactory(base = '/media/') {
    const createImage = imageFactory();
    const createVideo = videoFactory();
    return function (source, title) {
        if (source) {
            let mediaElement = null;
            if (source.endsWith('.jpg')) {
                mediaElement = createImage(`${base}${source}`);
            } else if (source.endsWith('.mp4')) {
                mediaElement = createVideo(`${base}${source}`);
            } else {
                console.error('unknown media format');
                return;
            }
            mediaElement.dataset.title = title;
            return mediaElement;
        } else {
            console.error('param source is undefined');
        }
    }
}
