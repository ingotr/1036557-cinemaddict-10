import MainMenuComponent from './components/mainMenu.js';
import FiltersComponent from './components/filters.js';
import UserRankComponent from './components/userRank.js';
import FilmsComponent from './components/films.js';
import FilmsListComponent from './components/filmsList';
import CardComponent from './components/card.js';
import CommentComponent from './components/comment.js';
import PopupComponent from './components/popup.js';
import ShowMoreButtonComponent from './components/showMoreButton.js';
import {generateDatum} from './mock/datum.js';
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

const datum = generateDatum(CARD_COUNT);

const closePopup = (popup) => {
  const filmPopUp = filmsElement.querySelector(`.film-details`);
  filmPopUp.remove();
  popup.getElement().remove();
  popup.removeElement();
};

const addCloseEventListenerPopup = (popup) => {
  popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    closePopup(popup);
  });
};

const addEventListenerToComponent = (card, popup, data) => {
  const onEscKeyPress = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup(popup);
      document.removeEventListener(`keydown`, onEscKeyPress);
    }
  };
  const popupOnOpen = () => {
    render(filmsElement, popup.getElement(), RenderPosition.BEFOREEND);
    const popupElement = filmsElement.querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = data.comments;
    popupCommentsList.slice(0, popupCommentsList.length)
      .forEach((comment) => render(commentsListElement, new CommentComponent(comment).getElement(), RenderPosition.BEFOREEND));

    document.addEventListener(`keydown`, onEscKeyPress);
  };

  card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, popupOnOpen);
  card.getElement().querySelector(`.film-card__title`).addEventListener(`click`, popupOnOpen);
  card.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, popupOnOpen);
  addCloseEventListenerPopup(popup);
};

let showingCardCount = CARD_ON_START;
datum.slice(0, showingCardCount)
  .forEach((data) => {
    const currentCardComponent = new CardComponent(data);
    render(filmListContainerElement, currentCardComponent.getElement(), RenderPosition.AFTERBEGIN);
    const currentPopupComponent = new PopupComponent(data);
    addEventListenerToComponent(currentCardComponent, currentPopupComponent, data);
  });

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

const topRatedList = getTopRatedFilms(datum);
const renderTopRatedFilms = () => {
  if (topRatedList.length > 0) {
    topRatedList.slice(0, topRatedList.length)
      .forEach((film) => {
        const currentCardComponent = new CardComponent(film);
        render(filmTopRatedElement, currentCardComponent.getElement(), RenderPosition.BEFOREEND);
        const currentPopupComponent = new PopupComponent(film);
        addEventListenerToComponent(currentCardComponent, currentPopupComponent, film);
      });
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

const mostCommentedList = getMostCommentedFilms(datum);
const renderMostCommentedFilms = () => {
  if (mostCommentedList.length > 0) {
    mostCommentedList.slice(0, mostCommentedList.length)
      .forEach((film) => {
        const currentCardComponent = new CardComponent(film);
        render(filmMostCommentedElement, currentCardComponent.getElement(), RenderPosition.BEFOREEND);
        const currentPopupComponent = new PopupComponent(film);
        addEventListenerToComponent(currentCardComponent, currentPopupComponent, film);
      });
  } else {
    filmMostCommentedElement.parentElement.remove();
  }
};
renderMostCommentedFilms();

const showMoreButtonComponent = new ShowMoreButtonComponent();
render(filmListContainerElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
showMoreButtonComponent.getElement().addEventListener(`click`, () => {
  const prevCardCount = showingCardCount;
  showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  datum.slice(prevCardCount, showingCardCount)
    .forEach((card) => render(filmListContainerElement, new CardComponent(card).getElement(), RenderPosition.AFTERBEGIN));

  if (showingCardCount >= datum.length) {
    showMoreButtonComponent.getElement().remove();
    showMoreButtonComponent.removeElement();
  }
});

const footerStatisticElement = document.querySelector(`.footer__statistics p`);
footerStatisticElement.textContent = `${datum.length} movies inside`;
