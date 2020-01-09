import FilterController from '../controllers/filter.js';
import StatsComponent from '../components/stats.js';
import SortComponent, {SortType} from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/films-list';
import NoFilmsComponent from '../components/no-films';

import ShowMoreButtonComponent from '../components/show-more-button.js';
import MovieControllerComponent from './movie.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {CARD_COUNT, EMOJI_ID} from '../const.js';

const SHOWING_CARDS_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TOPRATED_LIST_LENGTH = 2;
const MOSTCOMMENTED_LIST_LENGTH = 2;

const TOP_RATED_MARKUP = `<h2 class="films-list__title">Top rated</h2>`;
const MOST_COMMENTED_MARKUP = `<h2 class="films-list__title">Most commented</h2>`;
const FILMS_LIST_EXTRA_MARKUP = `films-list--extra`;

let showingCardCount = SHOWING_CARDS_ON_START;

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

const renderFilmCards = (films, filmsListContainer, popupContainer, onDataChange, onFiltersChange,
    onUserRatingChange, onViewChange, onCommentsCountChange, onEmojiChange) => {
  return films.map((film) => {
    const movieController = new MovieControllerComponent(filmsListContainer, popupContainer, onDataChange,
        onFiltersChange, onUserRatingChange, onViewChange, onCommentsCountChange, onEmojiChange);
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

    this._showingMovieCount = SHOWING_CARDS_ON_START;

    this._showedMovieControllers = [];
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
    this._filterController = new FilterController(this._container, this._moviesModel);

    this._statsComponent = new StatsComponent();
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmListContainerElement = null;
    this._filmTopRatedElement = null;
    this._filmMostCommentedElement = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFiltersChange = this._onFiltersChange.bind(this);
    this._onUserRatingChange = this._onUserRatingChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentsCountChange = this._onCommentsCountChange.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandlers(this._onFiltersChange);
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (showingCardCount >= this._movies.length) {
      return;
    }

    render(this._filmListContainerElement, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  renderCustomFilmList(filmList, filmListContainer) {
    if (filmList.length > 0) {
      return filmList.map((film) => {
        const movieController = new MovieControllerComponent(this._filmListContainerElement,
            this._filmsComponent, this._onDataChange, this._onFiltersChange,
            this._onUserRatingChange, this._onViewChange, this._onCommentsCountChange, this._onEmojiChange);

        movieController.render(film, filmListContainer);
        return movieController;
      });
    }
    return [];
  }

  render() {
    const container = this._container;

    this._filterController.render();
    const mainNavigationElement = this._container.querySelector(`.main-navigation`);

    render(mainNavigationElement, this._statsComponent.getElement(), RenderPosition.BEFOREEND);

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);

    render(this._filmsComponent.getElement(), new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    this._filmListContainerElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
    this._filmTopRatedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra .films-list__container`);
    this._filmMostCommentedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra:last-child .films-list__container`);

    const topRatedList = getTopRatedFilms(this._movies);
    const mostCommentedList = getMostCommentedFilms(this._movies);

    if (CARD_COUNT > 0) {
      this._renderMovies((this._movies.slice(0, showingCardCount)));
      this._renderShowMoreButton();

      this._renderTopRatedMovies(topRatedList);
      this._renderMostCommentedMovies(mostCommentedList);
    } else {
      render(this._filmListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

  }

  _removeMovies() {
    const filmListElement = this._filmListContainerElement;
    filmListElement.innerHTML = ``;

    this._showedMovieControllers = [];
  }

  _removeTopRatedMovies() {
    const topRatedListElement = this._filmTopRatedElement;
    topRatedListElement.innerHTML = ``;

    this._showedTopRatedMovieControllers = [];
  }

  _removeMostCommentedMovies() {
    const mostCommentedListElement = this._filmMostCommentedElement;
    mostCommentedListElement.innerHTML = ``;

    this._showedMostCommentedMovieControllers = [];
  }

  _renderMovies(movies) {
    const filmListElement = this._filmListContainerElement;

    const newFilms = renderFilmCards(movies, filmListElement,
        this._filmsComponent, this._onDataChange, this._onFiltersChange,
        this._onUserRatingChange, this._onViewChange, this._onCommentsCountChange, this._onEmojiChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._showingMovieCount = this._showedMovieControllers.length;
  }

  _renderTopRatedMovies(topRatedList) {
    const topRatedListElement = this._filmTopRatedElement;

    const newTopRatedFilms = this.renderCustomFilmList(topRatedList, topRatedListElement);
    this._showedTopRatedMovieControllers = this._showedTopRatedMovieControllers.concat(newTopRatedFilms);
  }

  _renderMostCommentedMovies(mostCommentedList) {
    const mostCommentedListElement = this._filmMostCommentedElement;

    const newMostCommentedFilms = this.renderCustomFilmList(mostCommentedList, mostCommentedListElement);
    this._showedMostCommentedMovieControllers = this._showedMostCommentedMovieControllers.concat(newMostCommentedFilms);
  }

  _onCommentsCountChange(movieController, oldData, newData, commentIndex, commentsListElement) {
    const topRatedList = getTopRatedFilms(this._movies);
    const mostCommentedList = getMostCommentedFilms(this._movies);

    if (newData === null) {
      const isSuccess = this._moviesModel.deleteComment(oldData.getCard().id, commentIndex);

      // if (isSuccess) {
      //   movieController.render(isSuccess);
      // }
    }

    this._removeMovies();
    this._removeTopRatedMovies();
    this._removeMostCommentedMovies();

    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_CARDS_ON_START));
    this._renderTopRatedMovies(topRatedList);
    this._renderMostCommentedMovies(mostCommentedList);

    const commentsList = commentsListElement;
    commentsList.innerHTML = ``;

    const newDataIndex = this._movies.findIndex((it) => it.id === oldData.getCard().id);

    movieController.render(this._movies[newDataIndex]);
    movieController.renderPopup();
  }

  _onDataChange() {
    this._filterController.render();
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

    this._removeMovies();
    this._renderMovies(sortedFilms);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton(sortedFilms, this._showMoreButtonComponent, this._filmListContainerElement);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onShowMoreButtonClick() {
    const prevCardCount = showingCardCount;
    showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    this._renderMovies(this._movies.slice(prevCardCount, showingCardCount));

    if (showingCardCount >= this._movies.length) {
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

  _onFiltersChange() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_CARDS_ON_START));
    this._renderShowMoreButton();
  }

  _onEmojiChange(emojiType, bigEmojiContainer) {
    switch (emojiType) {
      case EMOJI_ID.SMILE:
        bigEmojiContainer.src = `images/emoji/smile.png`;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EMOJI_ID.SMILE;
      case EMOJI_ID.SLEEPING:
        bigEmojiContainer.src = `images/emoji/sleeping.png`;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EMOJI_ID.SLEEPING;
      case EMOJI_ID.GRINNING:
        bigEmojiContainer.src = `images/emoji/puke.png`;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EMOJI_ID.GRINNING;
      case EMOJI_ID.ANGRY:
        bigEmojiContainer.src = `images/emoji/angry.png`;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EMOJI_ID.ANGRY;
    }
    return emojiType;
  }
}
