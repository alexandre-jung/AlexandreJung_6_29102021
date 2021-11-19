export default async function fetchData(url, onSuccess) {
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

export class DataFetcher {
    constructor(url) {
        this.url = url;
        this.data = null;
    }
    get() {

        if (!this.data) {
            console.log('first fetch');
            // here we need to use an arrow function to preserve `this`
            return fetchData(this.url, fetchedData => {
                this.data = fetchedData;
            });
        }

        console.log('return existing data');
        // here we need to use an arrow function to preserve `this`
        return new Promise(resolve => {
            resolve(this.data);
        });
    }
}

// const getDataFetcher = (url) => {

//     let dataRef = { data: null };

//     // return a Promise:
//     // not loaded yet: result of the fetch()
//     // already loaded: new Promise that resolves with existing data
//     return function () {

//         console.log(dataRef.data);

//         if (!dataRef.data) {
//             console.log('first fetch');
//             return fetchData(url, function (fetchedData) {
//                 console.log('data successfully fetched');
//                 dataRef.data = fetchedData;
//                 console.log('dataRef', dataRef);
//             });
//         }

//         console.log('return existing data');
//         return new Promise(function (resolve) {
//             resolve(dataRef.data);
//         });
//     }
// }

// export { getDataFetcher };
