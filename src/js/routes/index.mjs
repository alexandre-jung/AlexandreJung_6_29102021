import { Path } from "@/router";
import views from "@/views";

const routes = [
    new Path(`^${import.meta.env.BASE_URL}photographer/(?<id>\\d+)/?$`, views.photographer),
    new Path(`^${import.meta.env.BASE_URL}(home/?)?(?:\\?.*)?$`, views.home),
    new Path('.*', views.notFound),
];

export default routes;
