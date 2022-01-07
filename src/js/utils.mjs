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
