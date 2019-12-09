import FiltersComponent, {SortType} from './components/filters.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/filmsList';
import NoFilmsComponent from '../components/no-films';
import CardComponent from '../components/card.js';
import CommentComponent from '../components/comment.js';
import PopupComponent from '../components/popup.js';
import ShowMoreButtonComponent from '../components/showMoreButton.js';
import {render, RenderPosition} from '../utils/render.js';
import {CARD_COUNT} from '../const.js';

const CARD_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TOPRATED_LIST_LENGTH = 2;
const MOSTCOMMENTED_LIST_LENGTH = 2;

const TOP_RATED_MARKUP = `<h2 class="films-list__title">Top rated</h2>`;
const MOST_COMMENTED_MARKUP = `<h2 class="films-list__title">Most commented</h2>`;
const FILMS_LIST_EXTRA_MARKUP = `films-list--extra`;


const addEventListenerToComponent = (popContainer, card, popup, data) => {
  const onEscKeyPress = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      onPopUpClose(popup);
      document.removeEventListener(`keydown`, onEscKeyPress);
    }
  };

  const onPopUpClose = () => {
    const filmPopUp = popContainer.querySelector(`.film-details`);
    filmPopUp.remove();
    popup.getElement().remove();
    popup.removeElement();
  };

  const onPopupOpen = () => {
    render(popContainer, popup.getElement(), RenderPosition.BEFOREEND);
    const popupElement = popContainer.querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = data.comments;
    popupCommentsList.slice(0, popupCommentsList.length)
      .forEach((comment) => render(commentsListElement, new CommentComponent(comment).getElement(), RenderPosition.BEFOREEND));

    document.addEventListener(`keydown`, onEscKeyPress);
  };

  card.setCardElementsClickHandler(onPopupOpen);
  popup.setCloseButtonClickHandler(onPopUpClose);
  // addCloseEventListenerPopup(popup);
};

let showingCardCount = CARD_ON_START;

const renderFilmCards = (datum, container, popContainer) => {
  datum.slice(0, showingCardCount)
    .forEach((data) => {
      const currentCardComponent = new CardComponent(data);
      render(container, currentCardComponent.getElement(), RenderPosition.AFTERBEGIN);
      const currentPopupComponent = new PopupComponent(data);
      addEventListenerToComponent(popContainer, currentCardComponent, currentPopupComponent, data);
    });
};

const renderShowMoreButton = (datum, container) => {
  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(container, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
  showMoreButtonComponent.setClickHandler(() => {
    const prevCardCount = showingCardCount;
    showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    datum.slice(prevCardCount, showingCardCount)
      .forEach((card) => render(container, new CardComponent(card).getElement(), RenderPosition.AFTERBEGIN));

    if (showingCardCount >= datum.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
};

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

const renderTopRatedFilms = (filmList, container, popContainer) => {
  if (filmList.length > 0) {
    filmList.slice(0, filmList.length)
      .forEach((film) => {
        const currentCardComponent = new CardComponent(film);
        render(container, currentCardComponent.getElement(), RenderPosition.BEFOREEND);
        const currentPopupComponent = new PopupComponent(film);
        addEventListenerToComponent(popContainer, currentCardComponent, currentPopupComponent, film);
      });
  } else {
    container.parentElement.remove();
  }
};

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

const renderMostCommentedFilms = (filmList, container, popContainer) => {
  if (filmList.length > 0) {
    filmList.slice(0, filmList.length)
      .forEach((film) => {
        const currentCardComponent = new CardComponent(film);
        render(container, currentCardComponent.getElement(), RenderPosition.BEFOREEND);
        const currentPopupComponent = new PopupComponent(film);
        addEventListenerToComponent(popContainer, currentCardComponent, currentPopupComponent, film);
      });
  } else {
    container.parentElement.remove();
  }
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._filtersComponent = new FiltersComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
  }

  render(datum) {
    const container = this._container;

    render(container, this._filtersComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);
    const filmsElement = container.querySelector(`.films`);

    render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    const filmListContainerElement = container.querySelector(`.films-list__container`);
    const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
    const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

    const topRatedList = getTopRatedFilms(datum);
    const mostCommentedList = getMostCommentedFilms(datum);

    if (CARD_COUNT > 0) {
      renderFilmCards(datum, filmListContainerElement, filmsElement);
      renderShowMoreButton(datum, filmListContainerElement);
      renderTopRatedFilms(topRatedList, filmTopRatedElement, filmsElement);
      renderMostCommentedFilms(mostCommentedList, filmMostCommentedElement, filmsElement);
    } else {
      render(filmListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
