export async function fetchData(url, onSuccess) {
    return fetch(url).then(response => {
        if (response.ok && response.status == 200) {
            const extension = url.slice(url.lastIndexOf('.') + 1);
            if (extension == 'json') {
                return response.json();
            } else {
                return response.text();
            }
        }
    }).then(data => {
        if (onSuccess) {
            onSuccess(data);
        }
        return data;
    });
}

export default class DataFetcher {
    constructor(url) {
        this.url = url;
        this.data = null;
    }
    get() {

        if (!this.data) {
            return fetchData(this.url, fetchedData => this.data = fetchedData);
        }
        return new Promise(resolve => resolve(this.data));
    }
}

export function getAllTags(data) {
    const tagSet = new Set();
    data.photographers.forEach(photographer => {
        photographer.tags.forEach(tag => {
            tagSet.add(tag);
        });
    });
    return tagSet;
}
