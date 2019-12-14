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
  constructor(container) {
    this._container = container;

    this._filtersComponent = new FiltersComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieControllerComponent = new MovieControllerComponent(this._filmsListContainer, this._filmsContainer);
  }

  render(datum) {
    const container = this._container;

    render(container, this._filtersComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);

    const filmsElement = this._container.querySelector(`.films`);

    render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(filmsElement, new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    const filmListContainerElement = filmsElement.querySelector(`.films-list__container`);
    const filmTopRatedElement = filmsElement.querySelector(`.films-list--extra .films-list__container`);
    const filmMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

    const topRatedList = getTopRatedFilms(datum);
    const mostCommentedList = getMostCommentedFilms(datum);

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

    const renderShowMoreButton = () => {
      if (showingCardCount >= datum.length) {
        return;
      }

      render(this._filmListContainerElement, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevCardCount = showingCardCount;
        showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

        datum.slice(prevCardCount, showingCardCount)
          .forEach((card) => this._moviewControllerComponent.render(card));
        // .forEach((card) => render(this._filmListContainerElement, new CardComponent(card).getElement(), RenderPosition.AFTERBEGIN));

        if (showingCardCount >= datum.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    if (CARD_COUNT > 0) {
      renderFilmCards(datum.slice(0, showingCardCount), filmListContainerElement, filmsElement, this._onDataChange);
      renderShowMoreButton();
      renderTopRatedFilms(topRatedList, filmTopRatedElement);
      renderMostCommentedFilms(mostCommentedList, filmMostCommentedElement);

      this._filtersComponent.setSortTypeChangeHandler((sortType) => {
        let sortedFilms = [];

        switch (sortType) {
          case SortType.DATE_DOWN:
            sortedFilms = datum.slice().sort((a, b) => a.year - b.year);
            break;
          case SortType.RATING_DOWN:
            sortedFilms = datum.slice().sort((a, b) => a.rating - b.rating);
            break;
          case SortType.DEFAULT:
            sortedFilms = datum.slice(0, showingCardCount);
            break;
        }

        this._filmListContainerElement.innerHTML = ``;

        renderFilmCards(sortedFilms);

        if (sortType === SortType.DEFAULT) {
          renderShowMoreButton(sortedFilms, this._showMoreButtonComponent, this._filmListContainerElement);
        } else {
          remove(this._showMoreButtonComponent);
        }
      });

    } else {
      render(this._filmListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
