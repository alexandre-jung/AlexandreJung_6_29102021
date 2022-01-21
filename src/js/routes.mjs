import { Path } from "./router.mjs";
import views from "./views/index.mjs";

const routes = [
    new Path(`^${import.meta.env.BASE_URL}photographer/(?<id>\\d+)/?$`, views.photographer),
    new Path(`^${import.meta.env.BASE_URL}(home/?)?(?:\\?.*)?$`, views.home),
    new Path('.*', views.notFound),
];

export default routes;
