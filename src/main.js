import UserRankComponent from './components/user-rank.js';
import StatisticsCompoent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import PageControllerComponent from './controllers/page.js';
import {generateDatum} from './mock/datum.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {CARD_COUNT} from './const.js';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const filters = generateFilters(CARD_COUNT);

const datum = generateDatum(CARD_COUNT);

const moviesModel = new MoviesModel();
moviesModel.setMovies(datum);

render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${datum.length} movies inside`;

const pageController = new PageControllerComponent(mainElement, filters, moviesModel);
pageController.render();

render(mainElement, new StatisticsCompoent().getElement(), RenderPosition.BEFOREEND);
