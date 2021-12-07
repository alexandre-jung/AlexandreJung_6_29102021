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
        image.dataset.ref = src;
        return image;
    }
}

export function videoFactory() {
    const videoTemplate = document.createElement('video');
    videoTemplate.style.width = '100%';
    // videoTemplate.setAttribute('controls', '');
    return function (src) {
        const video = videoTemplate.cloneNode(false);
        video.src = src;
        video.dataset.ref = src;
        // const videoOverlay = document.createElement('div');
        // videoOverlay.classList.add('video-overlay');
        // videoOverlay.append(video);
        // return videoOverlay;
        return video;
    }
}

export function mediaFactory(base = '/media/') {
    const createImage = imageFactory();
    const createVideo = videoFactory();
    return function (source) {
        if (source) {
            if (source.endsWith('.jpg')) {
                return createImage(`${base}${source}`);
            } else if (source.endsWith('.mp4')) {
                return createVideo(`${base}${source}`);
            } else {
                console.error('unknown media format');
                return;
            }
        } else {
            console.error('param source is undefined');
        }
    }
}
