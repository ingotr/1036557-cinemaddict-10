import {createMainMenuTemplate} from "./components/mainMenu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createUserRankTemplate} from "./components/userRank.js";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmsListTemplate} from "./components/filmsList";
import {createDefaultCardTemplate} from "./components/defaultCard.js";
import {createPopUpTemplate} from "./components/popup.js";
import {createShowMoreButton} from "./components/showMoreButton.js";
import {generateCards} from "./mock/card.js";
import {generatePopup} from "./mock/popup.js";

const CARD_COUNT = 22;
const CARD_IN_FILMS_COUNT = 5;
const CARD_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const topRated = `<h2 class="films-list__title">Top rated</h2>`;
const mostCommented = `<h2 class="films-list__title">Most commented</h2>`;
const filmsSectionClassExtra = `films-list--extra`;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(mainElement, createMainMenuTemplate(CARD_IN_FILMS_COUNT));
render(mainElement, createFiltersTemplate());
render(mainElement, createFilmsTemplate());
render(headerElement, createUserRankTemplate());

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, createFilmsListTemplate());
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, topRated));
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, mostCommented));

const filmListElement = mainElement.querySelector(`.films-list`);
const filmListContainerElement = mainElement.querySelector(`.films-list__container`);
// const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
// const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

render(filmListContainerElement, createShowMoreButton(), `afterbegin`);

const cards = generateCards(CARD_COUNT);

let showingCardCount = CARD_ON_START;
cards.slice(1, showingCardCount).forEach((card) => render(filmListContainerElement, createDefaultCardTemplate(card), `afterbegin`));

// const createNewCards = (container, template, place = `beforeEnd`, number = CARD_IN_FILMS_COUNT) => {
//   new Array(number)
//     .fill(``)
//     .forEach(
//         () => render(container, template, place)
//     );
// };

// createNewCards(filmListContainerElement, createDefaultCardTemplate(), `afterbegin`);
// createNewCards(filmTopRatedElement, createDefaultCardTemplate(), `beforeEnd`, CARD_IN_EXTRA_COUNT);
// createNewCards(filmMostCommentedElement, createDefaultCardTemplate(), `beforeEnd`, CARD_IN_EXTRA_COUNT);

const popup = generatePopup();
render(filmsElement, createPopUpTemplate(popup));

const popUpCloseBtn = document.querySelector(`.film-details__close-btn`);
const onPopUpClose = () => {
  const filmPopUp = filmsElement.querySelector(`.film-details`);
  filmPopUp.classList.add(`visually-hidden`);
};
popUpCloseBtn.addEventListener(`click`, onPopUpClose);

const showMoreButton = filmListElement.querySelector(`.films-list__show-more`);
showMoreButton.addEventListener(`click`, () => {
  const prevCardCount = showingCardCount;
  showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardCount, showingCardCount)
  .forEach((card) => render(filmListContainerElement, createDefaultCardTemplate(card)), `afterbegin`);

  if (showingCardCount >= cards.length) {
    showMoreButton.remove();
  }
});

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${cards.length} movies inside`;
