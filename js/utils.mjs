export function getTemplateElement(name) {
    if ('content' in document.createElement('template')) {
        const templateRoot = document.querySelector(`[t-name='${name}']`);
        if (templateRoot && templateRoot.nodeName.toLowerCase() == 'template') {
            return document.importNode(templateRoot.content, true);
        }
    }
}
