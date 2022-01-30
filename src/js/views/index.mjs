import Home from '@/views/home.mjs';
import Photographer from '@/views/photographer.mjs';
import NotFound from '@/views/notFound.mjs';

const views = {
    home: new Home(),
    photographer: new Photographer(),
    notFound: new NotFound(),
}

export default views;
