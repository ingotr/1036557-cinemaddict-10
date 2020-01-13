import UserRankComponent from './components/user-rank.js';
import MoviesModel from './models/movies.js';
import PageControllerComponent from './controllers/page.js';
// import {MenuItem} from './components/main-menu.js';
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

// const setActiveMenuItem = () => {
//   // mainMenuComponent.setActiveItem(activeItem);
//   statisticsComponent.hide();
//   pageController.show();
// };

// const mainMenuComponent = pageController.getMainMenuComponent();
// console.log(mainMenuComponent);
// mainMenuComponent.setOnClick((menuItem) => {
//   console.log(`click on menu`);
//   switch (menuItem) {
//     case MenuItem.ALL:
//     case MenuItem.WATCHLIST:
//     case MenuItem.HISTORY:
//     case MenuItem.FAVORITES:
//       statisticsComponent.hide();
//       pageController.show();
//       break;
//     case MenuItem.STATS:
//       // mainMenuComponent.setActiveItem(MenuItem.STATS);
//       pageController.hide();
//       statisticsComponent.show();
//       break;
//   }
// });
