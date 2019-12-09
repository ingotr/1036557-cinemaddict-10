import MainMenuComponent from './components/mainMenu.js';
import UserRankComponent from './components/userRank.js';

import PageControllerComponent from './controllers/pageController.js';
import {generateDatum} from './mock/datum.js';
import {render, RenderPosition} from './utils/render.js';
import {CARD_COUNT} from './const.js';

// const addCloseEventListenerPopup = (popup) => {
//   popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
//     closePopup(popup);
//   });
// };
const CARD_IN_FILMS_COUNT = 5;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(mainElement, new MainMenuComponent(CARD_IN_FILMS_COUNT).getElement(), RenderPosition.BEFOREEND);
render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);


// render(filmsElement, new FilmsListComponent(), RenderPosition.BEFOREEND);
// render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP), RenderPosition.BEFOREEND);
// render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP), RenderPosition.BEFOREEND);

// const filmListContainerElement = mainElement.querySelector(`.films-list__container`);
// const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
// const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

const datum = generateDatum(CARD_COUNT);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${datum.length} movies inside`;

const pageController = new PageControllerComponent(mainElement);
pageController.render(datum);

