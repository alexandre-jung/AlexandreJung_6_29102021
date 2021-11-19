import './dropdown.mjs';
import fetchData from './api.mjs';
import Router from './router.mjs';
import routes from './routes.mjs';

// get content data
// const data = await fetchData('/api/data.json', 'json');

// create the router and its paths
const router = new Router();
routes.forEach(function(route) {
    router.add(route);
});

// delegate link events to the document
document.addEventListener('click', function (ev) {
    // link with rel=tag
    if (ev.target.nodeName.toLowerCase() == 'a' &&
        ev.target.rel == 'tag') {
        ev.preventDefault();
        const url = new URL(ev.target.href);
        const path = url.pathname;
        history.pushState({}, '', path);
        router.run(path);
    }
});

// run router when navigating back and forward
window.addEventListener('popstate', function (ev) {
    router.run(window.location.pathname, ev.state);
});
// run router on page load
router.run(location.pathname);
