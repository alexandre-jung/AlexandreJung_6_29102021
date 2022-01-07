class Path {
    constructor(regex, viewObject) {
        this.regex = regex;
        this.viewObject = viewObject;
        this.params = null;
    }

    match(path) {
        const match = path.match(this.regex);
        this.params = match?.groups;
        return !!match;
    }

    call(contentDataFetcher) {
        this.viewObject.renderView(this.params, contentDataFetcher);
    }
}

class Router {
    constructor(contentDataFetcher) {
        this.routes = [];
        this.contentDataFetcher = contentDataFetcher;
    }
    add(route) {
        this.routes.push(route);
    }
    run(path) {
        const targetRouteIdx = this.routes.findIndex(function (route) {
            return route.match(path);
        });
        const targetRoute = this.routes[targetRouteIdx];
        if (targetRouteIdx >= 0) {
            targetRoute.call(this.contentDataFetcher);
        } else {
            throw new Error(`${path} doesn't match any path`);
        }
    }
}

export default Router;
export { Path };
