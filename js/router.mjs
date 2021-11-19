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

    call() {
        this.viewObject.renderView(this.params);
    }
}

class Router {
    constructor() {
        this.routes = [];
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
            targetRoute.call();
        } else {
            throw new Error(`${path} doesn't match any path`);
        }
    }
}

export default Router;
export { Path };
