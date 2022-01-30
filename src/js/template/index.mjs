export function forEachElement(root, callback) {
    if (!root) return [];
    function _foreach(root) {
        if (
            root.nodeType &&
            (root.nodeType == Node.ELEMENT_NODE ||
                root.nodeType == Node.DOCUMENT_FRAGMENT_NODE)
        ) {
            callback(root);
        }
        if (root.firstChild) {
            for (const child of root.childNodes) {
                _foreach(child);
            }
        }
    }
    _foreach(root);
}

export function flattenElements(root) {
    const result = [];
    if (root) forEachElement(root, (element) => result.push(element));
    return result;
}

function forEachAttribute(element, callback) {
    if (element && element.attributes && callback)
        for (const a of Array.from(element.attributes))
            callback(a.name, a.value);
}

function stripPrefixedAttributes(element, prefix) {
    forEachAttribute(element, (key) => {
        if (key.startsWith(prefix)) element.removeAttribute(key);
    });
}

export default class Template {
    constructor(templateElement) {
        this.fragment = templateElement;
    }

    static fillElement(element, data, prefix) {
        forEachAttribute(element, (templateAttributeName, value) => {
            if (templateAttributeName.startsWith(prefix)) {
                const targetAttributeName = templateAttributeName.slice(
                    prefix.length
                );
                if (targetAttributeName) {
                    if (value in data) {
                        switch (targetAttributeName.toLowerCase()) {
                            case "text":
                                element.textContent = data[value];
                                break;
                            case "style":
                                Object.assign(element.style, data[value]);
                                break;
                            case "handle":
                                break;
                            default:
                                element.setAttribute(
                                    targetAttributeName,
                                    data[value]
                                );
                        }
                    }
                }
            }
        });
    }

    static getElementHandles(root, filterAttribute) {
        if (!root) return {};
        const elements = Array.isArray(root) ? root : flattenElements(root);
        const result = {};
        elements.forEach((element) => {
            if (element.nodeType && element.nodeType == Node.ELEMENT_NODE) {
                const attribute = element.getAttribute(filterAttribute);
                if (attribute) {
                    if (attribute in result) {
                        throw new Error(
                            [
                                `${filterAttribute} must be unique in template scope`,
                                `Duplicate value: ${attribute}`,
                            ].join("\n")
                        );
                    }
                    result[attribute] = element;
                }
            }
        });
        return result;
    }

    static fill(element, data = {}, prefix) {
        flattenElements(element).forEach((element) => {
            Template.fillElement(element, data, prefix);
        });
        return element;
    }

    render(data) {
        const fragment = this.fragment.cloneNode(true);
        const handles = Template.getElementHandles(fragment, "x:handle");
        Template.fill(fragment, data, "x:");
        flattenElements(fragment).forEach((element) =>
            stripPrefixedAttributes(element, "x:")
        );
        return [fragment, handles];
    }
}
