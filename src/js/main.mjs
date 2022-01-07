import '../scss/main.scss';
import './dropdown.mjs';
import DataFetcher from './api.mjs';
import Router from './router.mjs';
import routes from './routes.mjs';

const contentDataFetcher = new DataFetcher('/api/data.json');

// create the router and its paths
const router = new Router(contentDataFetcher);
routes.forEach(function (route) {
    router.add(route);
});

function runRouter(href) {
    const url = new URL(href);
    const path = url.pathname + url.search;
    history.pushState({}, '', path);
    router.run(path);
}

// delegate navigation events to the document
document.addEventListener('click', function (ev) {
    if (ev.target.nodeName.toLowerCase() == 'a' &&
        ev.target.rel == 'tag') {
        ev.preventDefault();
        runRouter(ev.target.href);
    } else if (ev.target.hasAttribute('data-navlink')) {
        const link = ev.target.closest('[rel=tag]');
        ev.preventDefault();
        runRouter(link.href);
    }
});

// run router when navigating back and forward
window.addEventListener('popstate', function (ev) {
    router.run(window.location.pathname, ev.state);
});
// run router on page load
runRouter(location);
