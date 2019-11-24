const CARD_IN_FILMS_COUNT = 5;
const CARD_IN_EXTRA_COUNT = 2;

import {createMainMenuTemplate} from "./components/mainMenu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createUserRankTemplate} from "./components/userRank.jsnp";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmsListTemplate} from "./components/filmsList";
import {createDefaultCardTemplate} from "./components/defaultCard.js";
import {createPopUpTemplate} from "./components/popup.js";
import {createShowMoreButton} from "./components/showMoreButton.js";

const topRated = `<h2 class="films-list__title">Top rated</h2>`;
const mostCommented = `<h2 class="films-list__title">Most commented</h2>`;
const filmsSectionClassExtra = `films-list--extra`;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(mainElement, createMainMenuTemplate());
render(mainElement, createFiltersTemplate());
render(mainElement, createFilmsTemplate());
render(headerElement, createUserRankTemplate());

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, createFilmsListTemplate());
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, topRated));
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, mostCommented));

const filmListContainerElement = mainElement.querySelector(`.films-list__container`);
const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

render(filmListContainerElement, createShowMoreButton());

const createNewCards = (container, template, place = `beforeEnd`, number = CARD_IN_FILMS_COUNT) => {
  new Array(number)
    .fill(``)
    .forEach(
        () => render(container, template, place)
    );
};

createNewCards(filmListContainerElement, createDefaultCardTemplate(), `afterbegin`);
createNewCards(filmTopRatedElement, createDefaultCardTemplate(), `beforeEnd`, CARD_IN_EXTRA_COUNT);
createNewCards(filmMostCommentedElement, createDefaultCardTemplate(), `beforeEnd`, CARD_IN_EXTRA_COUNT);

render(filmsElement, createPopUpTemplate());

const popUpCloseBtn = document.querySelector(`.film-details__close-btn`);
const onPopUpClose = () => {
  const filmPopUp = filmsElement.querySelector(`.film-details`);
  filmPopUp.classList.add(`visually-hidden`);
};
popUpCloseBtn.addEventListener(`click`, onPopUpClose);
