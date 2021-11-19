import Home from './home.mjs';
import Photographer from './photographer.mjs';
import NotFound from './notFound.mjs';

const views = {
    home: new Home(),
    photographer: new Photographer(),
    notFound: new NotFound(),
}

export default views;
