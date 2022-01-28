export function getTemplateElement(name) {
    if ('content' in document.createElement('template')) {
        const templateRoot = document.querySelector(`[t-name='${name}']`);
        if (templateRoot && templateRoot.nodeName.toLowerCase() == 'template') {
            return document.importNode(templateRoot.content, true);
        }
    }
}

export function rotateIndex(idx, max) {
    if (idx < 0) {
        return max;
    } else if (idx > max) {
        return 0;
    }
    return idx;
}

export function generateThumbnailFilename(file) {
    if (file.endsWith('.jpg')) {
        return file.slice(0, -4) + '.thumbnail.webp';
    }
    return file;
}

export function generateFilename(file) {
    if (file.endsWith('.thumbnail.webp')) {
        return file.slice(0, -15) + '.jpg';
    }
    return file;
}

export function wrapElement(element, nodeType) {
    const wrapper = document.createElement(nodeType);
    wrapper.append(element);
    return wrapper;
}
