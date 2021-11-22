import { Path } from "./router.mjs";
import views from "./views/index.mjs";

const routes = [
    new Path('^/photographer/(?<id>\\d+)/?$', views.photographer),
    new Path('^/(home/?)?(?:\\?.*)?$', views.home),
    new Path('.*', views.notFound),
];

export default routes;
