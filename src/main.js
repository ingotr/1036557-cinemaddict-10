import MainMenuComponent from './components/mainMenu.js';
import UserRankComponent from './components/userRank.js';
import PageControllerComponent from './controllers/page.js';
import {generateDatum} from './mock/datum.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {CARD_COUNT} from './const.js';

// const CARD_IN_FILMS_COUNT = 5;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const filters = generateFilters(CARD_COUNT);

render(mainElement, new MainMenuComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const datum = generateDatum(CARD_COUNT);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${datum.length} movies inside`;

const pageController = new PageControllerComponent(mainElement, filters);
pageController.render(datum);

