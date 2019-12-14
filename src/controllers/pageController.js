import FiltersComponent, {SortType} from '../components/filters.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/filmsList';
import NoFilmsComponent from '../components/no-films';
import ShowMoreButtonComponent from '../components/showMoreButton.js';
import MovieControllerComponent from './movie.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {CARD_COUNT} from '../const.js';

const CARD_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TOPRATED_LIST_LENGTH = 2;
const MOSTCOMMENTED_LIST_LENGTH = 2;

const TOP_RATED_MARKUP = `<h2 class="films-list__title">Top rated</h2>`;
const MOST_COMMENTED_MARKUP = `<h2 class="films-list__title">Most commented</h2>`;
const FILMS_LIST_EXTRA_MARKUP = `films-list--extra`;

let showingCardCount = CARD_ON_START;

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

const renderFilmCards = (films, filmsListContainer, popupContainer, onDataChange) => {
  return films.map((film) => {
    const movieController = new MovieControllerComponent(filmsListContainer, popupContainer, onDataChange);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container, filters) {
    this._container = container;

    this._filters = filters;

    this._films = [];
    this._showedMovieControllers = [];
    this._filtersComponent = new FiltersComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieControllerComponent = new MovieControllerComponent(this._filmsListContainer, this._filmsContainer);
    this._filmsComponent = this._container.querySelector(`.films`);
    this._filmListContainerElement = this._filmsComponent.querySelector(`.films-list__container`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._filtersComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderShowMoreButton() {
    if (showingCardCount >= this._films.length) {
      return;
    }

    render(this._filmListContainerElement, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevCardCount = showingCardCount;
      showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

      this._films.slice(prevCardCount, showingCardCount)
        .forEach((card) => this._moviewControllerComponent.render(card));

      const newFilms = renderFilmCards(this._films.slice(prevCardCount, showingCardCount), this._filmListContainerElement, this._filmsComponent, this._onDataChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newFilms);

      if (showingCardCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  render(films) {
    this._films = films;
    const container = this._container;

    render(container, this._filtersComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);

    render(this._filmsComponent, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    const filmListContainerElement = this._filmsComponent.querySelector(`.films-list__container`);
    const filmTopRatedElement = this._filmsComponent.querySelector(`.films-list--extra .films-list__container`);
    const filmMostCommentedElement = this._filmsComponent.querySelector(`.films-list--extra:last-child .films-list__container`);

    const topRatedList = getTopRatedFilms(films);
    const mostCommentedList = getMostCommentedFilms(films);

    const renderTopRatedFilms = (filmList, topRatedContainer) => {
      if (filmList.length > 0) {
        filmList.slice(0, filmList.length)
          .forEach((film) => this._movieControllerComponent.render(film, topRatedContainer));
      } else {
        container.parentElement.remove();
      }
    };

    const renderMostCommentedFilms = (filmList, mostCommentedContainer) => {
      if (filmList.length > 0) {
        filmList.slice(0, filmList.length)
          .forEach((film) => this._movieControllerComponent.render(film, mostCommentedContainer));
      } else {
        container.parentElement.remove();
      }
    };

    if (CARD_COUNT > 0) {
      const newFilms = renderFilmCards(films.slice(0, showingCardCount), filmListContainerElement, this._filmsComponent, this._onDataChange);
      this._showedMovieControllers = this.__showedMovieControllers.concat(newFilms);

      renderFilmCards(films.slice(0, showingCardCount), filmListContainerElement, this._filmsComponent, this._onDataChange);
      this._renderShowMoreButton();
      renderTopRatedFilms(topRatedList, filmTopRatedElement);
      renderMostCommentedFilms(mostCommentedList, filmMostCommentedElement);
    } else {
      render(this._filmListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = this._films.slice().sort((a, b) => a.year - b.year);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = this._films.slice().sort((a, b) => a.rating - b.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._films.slice(0, showingCardCount);
        break;
    }

    this._filmListContainerElement.innerHTML = ``;

    const newFilms = renderFilmCards(sortedFilms, this._filmListContainerElement, this._filmsComponent, this._onDataChange);
    this._showedMovieControllers = newFilms;

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton(sortedFilms, this._showMoreButtonComponent, this._filmListContainerElement);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }
}
