import FiltersComponent, {SortType} from '../components/filters.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/films-list';
import NoFilmsComponent from '../components/no-films';
import ShowMoreButtonComponent from '../components/show-more-button.js';
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
  if (a.commentsNumber > b.commentsNumber) {
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

const renderFilmCards = (films, filmsListContainer, popupContainer, onDataChange, onFiltersChange, onUserRatingChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieControllerComponent(filmsListContainer, popupContainer, onDataChange, onFiltersChange, onUserRatingChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container, filters, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._movies = this._moviesModel.getMovies();

    this._filters = filters;

    this._showedMovieControllers = [];
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
    this._filtersComponent = new FiltersComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmListContainerElement = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onUserRatingChange = this._onUserRatingChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._filtersComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandlers(this._onFilterChange);
  }

  _renderShowMoreButton() {
    if (showingCardCount >= this._movies.length) {
      return;
    }

    render(this._filmListContainerElement, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevCardCount = showingCardCount;
      showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

      const newFilms = renderFilmCards(this._movies.slice(prevCardCount, showingCardCount),
          this._filmListContainerElement, this._filmsComponent, this._onDataChange, this._onFiltersChange, this._onUserRatingChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);

      if (showingCardCount >= this._movies.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  render() {
    const container = this._container;

    render(container, this._filtersComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);

    render(this._filmsComponent.getElement(), new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    this._filmListContainerElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
    const filmTopRatedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra .films-list__container`);
    const filmMostCommentedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra:last-child .films-list__container`);

    const topRatedList = getTopRatedFilms(this._movies);
    const mostCommentedList = getMostCommentedFilms(this._movies);

    const renderCustomFilmList = (filmList, filmListContainer) => {
      if (filmList.length > 0) {
        return filmList.map((film) => {
          const movieController = new MovieControllerComponent(this._filmListContainerElement,
              this._filmsComponent, this._onDataChange, this._onFiltersChange, this._onUserRatingChange, this._onViewChange);

          movieController.render(film, filmListContainer);
          return movieController;
        });
      }
      return [];
    };

    if (CARD_COUNT > 0) {
      const newFilms = renderFilmCards(this._movies.slice(0, showingCardCount), this._filmListContainerElement,
          this._filmsComponent, this._onDataChange, this._onFiltersChange, this._onUserRatingChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);

      this._renderShowMoreButton();

      const newTopRatedFilms = renderCustomFilmList(topRatedList, filmTopRatedElement);
      this._showedTopRatedMovieControllers = this._showedTopRatedMovieControllers.concat(newTopRatedFilms);

      const newMostCommentedFilms = renderCustomFilmList(mostCommentedList, filmMostCommentedElement);
      this._showedMostCommentedMovieControllers = this._showedMostCommentedMovieControllers.concat(newMostCommentedFilms);

    } else {
      render(this._filmListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

  }

  // _onFiltersChange(filterType, filterChanged) {
  //   const filterWatchlistCount = document.querySelector(`a[href="#watchlist"] span`);
  //   const filterHistoryCount = document.querySelector(`a[href="#history"] span`);
  //   const filterFavoritesCount = document.querySelector(`a[href="#favorites"] span`);

  //   switch (filterType) {
  //     case `watchlist`:
  //       renderFilter(this._filters, FILTER_NAME_INDEX.WATCHLIST, filterWatchlistCount, Boolean(filterChanged));
  //       break;
  //     case `history`:
  //       renderFilter(this._filters, FILTER_NAME_INDEX.HISTORY, filterHistoryCount, Boolean(filterChanged));
  //       break;
  //     case `favorites`:
  //       renderFilter(this._filters, FILTER_NAME_INDEX.FAVORITES, filterFavoritesCount, Boolean(filterChanged));
  //       break;
  //   }
  // }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
    }
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = this._movies.slice().sort((a, b) => a.year - b.year);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = this._movies.slice().sort((a, b) => a.rating - b.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._movies.slice(0, showingCardCount);
        break;
    }

    this._filmListContainerElement.innerHTML = ``;

    const newFilms = renderFilmCards(sortedFilms, this._filmListContainerElement,
        this._filmsComponent, this._onDataChange, this._onFiltersChange, this._onUserRatingChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton(sortedFilms, this._showMoreButtonComponent, this._filmListContainerElement);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onUserRatingChange(userRatingField, userRatingValue) {
    userRatingField.innerHTML = `Your rate ${userRatingValue}`;
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => {
      it._setDefaultView();
    });
    this._showedTopRatedMovieControllers.forEach((it) => {
      it._setDefaultView();
    });
    this._showedMostCommentedMovieControllers.forEach((it) => {
      it._setDefaultView();
    });
  }

  _onFilterChange() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, CARD_ON_START));
    this._renderShowMoreButton();
  }
}
