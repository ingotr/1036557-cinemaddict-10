import MainMenuComponent from './components/mainMenu.js';
import UserRankComponent from './components/userRank.js';
import FilmsListComponent from '../components/filmsList';
import PageControllerComponent from './controllers/pageController.js';
import {generateDatum} from './mock/datum.js';
import {render, RenderPosition} from './utils/render.js';
import {CARD_COUNT} from './const.js';

const CARD_IN_FILMS_COUNT = 5;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(mainElement, new MainMenuComponent(CARD_IN_FILMS_COUNT).getElement(), RenderPosition.BEFOREEND);
render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
const filmListContainerElement = mainElement.querySelector(`.films-list__container`);

const datum = generateDatum(CARD_COUNT);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${datum.length} movies inside`;

const pageController = new PageControllerComponent(mainElement, filmsElement, filmListContainerElement);
pageController.render(datum);

