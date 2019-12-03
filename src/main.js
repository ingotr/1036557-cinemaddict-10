import MainMenuComponent from './components/mainMenu.js';
import FiltersComponent from './components/filters.js';
import UserRankComponent from './components/userRank.js';
import FilmsComponent from './components/films.js';
import FilmsListComponent from './components/filmsList';
import CardComponent from './components/defaultCard.js';
import CommentComponent from './components/comment.js';
import PopupComponent from './components/popup.js';
import ShowMoreButtonComponent from './components/showMoreButton.js';
import {generateCards} from './mock/card.js';
import {generatePopup} from './mock/popup.js';
import {render, RenderPosition} from './utils.js'

const CARD_COUNT = 22;
const CARD_IN_FILMS_COUNT = 5;
const CARD_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TOPRATED_LIST_LENGTH = 2;
const MOSTCOMMENTED_LIST_LENGTH = 2;

const topRated = `<h2 class="films-list__title">Top rated</h2>`;
const mostCommented = `<h2 class="films-list__title">Most commented</h2>`;
const filmsSectionClassExtra = `films-list--extra`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(mainElement, createMainMenuTemplate(CARD_IN_FILMS_COUNT));
// render(mainElement, new MainMenuComponent(CARD_IN_FILMS_COUNT), RenderPosition.BEFOREEND)

render(mainElement, createFiltersTemplate());
render(mainElement, createFilmsTemplate());
render(headerElement, createUserRankTemplate());

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, createFilmsListTemplate());
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, topRated));
render(filmsElement, createFilmsListTemplate(filmsSectionClassExtra, mostCommented));

const filmListElement = mainElement.querySelector(`.films-list`);
const filmListContainerElement = mainElement.querySelector(`.films-list__container`);
const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

render(filmListElement, createShowMoreButton());

const cards = generateCards(CARD_COUNT);

let showingCardCount = CARD_ON_START;
cards.slice(0, showingCardCount).forEach((card) => render(filmListContainerElement, createDefaultCardTemplate(card), `afterbegin`));

const isPositiveRating = (films) => {
  return films.some((film) => film.rating > 0);
};

const compareRating = (b, a) => {
  if (a.rating > b.rating) {
    return 1;
  }
  if (a.rating < b.rating) {
    return -1;
  }
  return 0;
};

const filterTopRatedFilms = (films) => {
  let topRatedList = films.sort(compareRating);
  topRatedList = topRatedList.slice(0, TOPRATED_LIST_LENGTH);

  return topRatedList;
};

const getTopRatedFilms = (films) => {
  return isPositiveRating(films) ? filterTopRatedFilms(films) : [];
};

const topRatedList = getTopRatedFilms(cards);
const renderTopRatedFilms = () => {
  if (topRatedList.length > 0) {
    topRatedList.slice(0, topRatedList.length).forEach((film) => render(filmTopRatedElement, createDefaultCardTemplate(film), `beforeEnd`));
  } else {
    filmTopRatedElement.parentElement.remove();
  }
};
renderTopRatedFilms();

const isPositiveCommentsNumber = (films) => {
  return films.some((film) => film.commentsNumber > 0);
};

const compareCommentsNumber = (b, a) => {
  if (a.commentsNumber > b.commentsNumbering) {
    return 1;
  }
  if (a.commentsNumber < b.commentsNumber) {
    return -1;
  }
  return 0;
};

const filterMostCommentedFilms = (films) => {
  let mostCommentedList = films.sort(compareCommentsNumber);
  mostCommentedList = mostCommentedList.slice(0, MOSTCOMMENTED_LIST_LENGTH);

  return mostCommentedList;
};

const getMostCommentedFilms = (films) => {
  return isPositiveCommentsNumber(films) ? filterMostCommentedFilms(films) : [];
};

const mostCommentedList = getMostCommentedFilms(cards);
const renderMostCommentedFilms = () => {
  if (mostCommentedList.length > 0) {
    mostCommentedList.slice(0, mostCommentedList.length).forEach((film) => render(filmMostCommentedElement, createDefaultCardTemplate(film), `beforeEnd`));
  } else {
    filmMostCommentedElement.parentElement.remove();
  }
};
renderMostCommentedFilms();

const popup = generatePopup();
render(filmsElement, createPopUpTemplate(popup));
const popupElement = filmsElement.querySelector(`.film-details`);
const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
const popupCommentsList = popup.comments;
popupCommentsList.slice(0, popupCommentsList.length).forEach((comment) =>render(commentsListElement, createCommentMarkup(comment)));

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
