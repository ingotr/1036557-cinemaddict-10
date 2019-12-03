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
import {render, RenderPosition} from './utils.js';

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

render(mainElement, new MainMenuComponent(CARD_IN_FILMS_COUNT).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FiltersComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);
render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);
render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
render(filmsElement, new FilmsListComponent(filmsSectionClassExtra, topRated).getElement(), RenderPosition.BEFOREEND);
render(filmsElement, new FilmsListComponent(filmsSectionClassExtra, mostCommented).getElement(), RenderPosition.BEFOREEND);

const filmListContainerElement = mainElement.querySelector(`.films-list__container`);
const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

const cards = generateCards(CARD_COUNT);

let showingCardCount = CARD_ON_START;
cards.slice(0, showingCardCount)
.forEach((card) => render(filmListContainerElement, new CardComponent(card).getElement(), RenderPosition.AFTERBEGIN));

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
    topRatedList.slice(0, topRatedList.length)
      .forEach((film) => render(filmTopRatedElement, new CardComponent(film).getElement(), RenderPosition.BEFOREEND));
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
    mostCommentedList.slice(0, mostCommentedList.length)
    .forEach((film) => render(filmMostCommentedElement, new CardComponent(film).getElement(), RenderPosition.BEFOREEND));
  } else {
    filmMostCommentedElement.parentElement.remove();
  }
};
renderMostCommentedFilms();

const popup = generatePopup();
render(filmsElement, new PopupComponent(popup).getElement(), RenderPosition.BEFOREEND);
const popupElement = filmsElement.querySelector(`.film-details`);
const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
const popupCommentsList = popup.comments;
popupCommentsList.slice(0, popupCommentsList.length)
.forEach((comment) =>render(commentsListElement, new CommentComponent(comment).getElement(), RenderPosition.BEFOREEND));

const popUpCloseBtn = document.querySelector(`.film-details__close-btn`);
const onPopUpClose = () => {
  const filmPopUp = filmsElement.querySelector(`.film-details`);
  filmPopUp.classList.add(`visually-hidden`);
};
popUpCloseBtn.addEventListener(`click`, onPopUpClose);

const showMoreButtonComponent = new ShowMoreButtonComponent();
render(filmListContainerElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
showMoreButtonComponent.getElement().addEventListener(`click`, () => {
  const prevCardCount = showingCardCount;
  showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardCount, showingCardCount)
  .forEach((card) => render(filmListContainerElement, new CardComponent(card).getElement(), RenderPosition.AFTERBEGIN));

  if (showingCardCount >= cards.length) {
    showMoreButtonComponent.getElement().remove();
    showMoreButtonComponent.removeElement();
  }
});

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${cards.length} movies inside`;
