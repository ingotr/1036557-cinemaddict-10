import FilterController from '../controllers/filter.js';
import SortComponent, {SortType} from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/films-list';
import NoFilmsComponent from '../components/no-films';
import StatisticsComponent from '../components/statistics.js';
import UserRankComponent from '../components/user-rank.js';

import ShowMoreButtonComponent from '../components/show-more-button.js';
import MovieControllerComponent from './movie.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {getWatchedMovies} from '../utils/filter.js';
import {EmojiId, StatisticFilterId} from '../const.js';

const HIDDEN_CLASS = `visually-hidden`;

const SHOWING_CARD = {
  ON_START: 5,
  COUNT_BY_BUTTON: 5,
};

const CUSTOM_MOVIES_LIST_LENGTH = {
  TOPRATED: 2,
  MOSTCOMMENTED: 2,
};

const TOP_RATED_MARKUP = `<h2 class="films-list__title">Top rated</h2>`;
const MOST_COMMENTED_MARKUP = `<h2 class="films-list__title">Most commented</h2>`;
const FILMS_LIST_EXTRA_MARKUP = `films-list--extra`;

let showingCardCount = SHOWING_CARD.ON_START;

const isPositiveRating = (films) => {
  return films.some((film) => film.filmInfo.totalRating > 0);
};

const compareRating = (b, a) => {
  if (a.filmInfo.totalRating > b.filmInfo.totalRating) {
    return 1;
  }
  if (a.filmInfo.totalRating < b.filmInfo.totalRating) {
    return -1;
  }
  return 0;
};

const filterTopRatedFilms = (films) => {
  let topRatedList = films.sort(compareRating);
  topRatedList = topRatedList.slice(0, CUSTOM_MOVIES_LIST_LENGTH.TOPRATED);

  return topRatedList;
};

const getTopRatedFilms = (films) => {
  return isPositiveRating(films) ? filterTopRatedFilms(films) : [];
};

const isPositiveCommentsNumber = (films) => {
  return films.some((film) => film.comments.length > 0);
};

const compareCommentsNumber = (b, a) => {
  if (a.comments.length > b.comments.length) {
    return 1;
  }
  if (a.comments.length < b.comments.length) {
    return -1;
  }
  return 0;
};

const filterMostCommentedFilms = (films) => {
  let mostCommentedList = films.sort(compareCommentsNumber);
  mostCommentedList = mostCommentedList.slice(0, CUSTOM_MOVIES_LIST_LENGTH.MOSTCOMMENTED);

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
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._movies = [];
    this._api = api;

    this._showingMovieCount = SHOWING_CARD.ON_START;

    this._statisticsComponent = null;

    this._showedMovieControllers = [];
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
    this._filterController = null;

    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._userRankComponent = new UserRankComponent();
    this._filmListContainerElement = null;
    this._filmTopRatedElement = null;
    this._filmMostCommentedElement = null;
    this._mainMenuComponent = null;

    this._currentFilterTargetElement = null;

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

  getCurrentFilterTarget() {
    return this._currentFilterTargetElement;
  }

  setCurrentFilterTarget(target) {
    this._currentFilterTargetElement = target;
  }

  render() {
    this._movies = this._moviesModel.getMovies();

    this._statisticsComponent = new StatisticsComponent(this._moviesModel);
    this._filterController = new FilterController(this._container, this._moviesModel,
        this._statisticsComponent, this, this._currentFilterTargetElement);

    const container = this._container;

    this._filterController.render(this._currentFilterTargetElement);

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._filmsComponent.getElement(), RenderPosition.BEFOREEND);

    render(container, this._statisticsComponent.getElement(), RenderPosition.BEFOREEND);
    this._statisticsComponent.setStatisticsFiltersHandler(() => {
      this._onStatisticsFilterChange(event.target.id);
    });
    this._statisticsComponent.renderStatistics();
    this._statisticsComponent.hide();

    render(this._filmsComponent.getElement(), new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, TOP_RATED_MARKUP).getElement(), RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), new FilmsListComponent(FILMS_LIST_EXTRA_MARKUP, MOST_COMMENTED_MARKUP).getElement(), RenderPosition.BEFOREEND);

    this._filmListContainerElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
    this._filmTopRatedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra .films-list__container`);
    this._filmMostCommentedElement = this._filmsComponent.getElement().querySelector(`.films-list--extra:last-child .films-list__container`);

    const headerElement = document.querySelector(`.header`);
    const watchedMoviesLength = getWatchedMovies(this._movies).length;
    this._userRankComponent.setUserRank(watchedMoviesLength);
    render(headerElement, this._userRankComponent.getElement(), RenderPosition.BEFOREEND);

    const topRatedList = getTopRatedFilms(this._movies);
    const mostCommentedList = getMostCommentedFilms(this._movies);

    if (this._movies.length > 0) {
      this._renderMovies((this._movies.slice(0, showingCardCount)));
      if (this._movies.length > 2) {
        this._renderShowMoreButton();
      }

      this._renderTopRatedMovies(topRatedList);
      this._renderMostCommentedMovies(mostCommentedList);
    } else {
      render(this._filmListContainerElement, this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
    }

  }

  hide() {
    this._filmsComponent.hide();
  }

  show() {
    this._filmsComponent.show();
  }

  hideLoadingScreen() {
    this._filmsComponent.hideLoadingTitle(this._filmsComponent);
  }

  renderCustomFilms(filmList, filmListContainer) {
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

  _renderShowMoreButton() {
    const movies = this._moviesModel.getMovies();
    remove(this._showMoreButtonComponent);

    if (showingCardCount >= movies.length) {
      return;
    }

    if (movies.length <= SHOWING_CARD.ON_START) {
      return;
    }

    render(this._filmListContainerElement, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _removeMovies() {
    const filmListElement = this._filmListContainerElement;
    filmListElement.innerHTML = ``;

    this._showedMovieControllers = [];
  }

  _removeTopRatedMovies() {
    const topRatedListElement = this._filmTopRatedElement;
    topRatedListElement.innerHTML = ``;
    topRatedListElement.classList.add(HIDDEN_CLASS);

    this._showedTopRatedMovieControllers = [];
  }

  _removeMostCommentedMovies() {
    const mostCommentedListElement = this._filmMostCommentedElement;
    mostCommentedListElement.innerHTML = ``;
    mostCommentedListElement.classList.add(HIDDEN_CLASS);

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

    topRatedListElement.classList.remove(HIDDEN_CLASS);
    const newTopRatedFilms = this.renderCustomFilms(topRatedList, topRatedListElement);
    this._showedTopRatedMovieControllers = this._showedTopRatedMovieControllers.concat(newTopRatedFilms);
  }

  _renderMostCommentedMovies(mostCommentedList) {
    const mostCommentedListElement = this._filmMostCommentedElement;

    mostCommentedListElement.classList.remove(HIDDEN_CLASS);
    const newMostCommentedFilms = this.renderCustomFilms(mostCommentedList, mostCommentedListElement);
    this._showedMostCommentedMovieControllers = this._showedMostCommentedMovieControllers.concat(newMostCommentedFilms);
  }

  _removeOldMoviesData() {
    this._removeMovies();
    this._removeTopRatedMovies();
    this._removeMostCommentedMovies();
  }

  _renderNewMoviesData() {
    const newMovies = this._moviesModel.getMovies();
    this._renderMovies(newMovies.slice(0, SHOWING_CARD.ON_START));

    const topRatedList = getTopRatedFilms(newMovies);
    const mostCommentedList = getMostCommentedFilms(newMovies);

    this._renderTopRatedMovies(topRatedList);
    this._renderMostCommentedMovies(mostCommentedList);
  }

  _renderNewPopupData(movieController, sourceOfNewData, commentsListElement) {
    const popupCommentsList = sourceOfNewData.comments;

    movieController.renderComments(popupCommentsList, commentsListElement);
  }

  _renderFilteredMovies(movies, topRatedList, mostCommentedList) {
    this._renderMovies(movies.slice(0, SHOWING_CARD.ON_START));

    if (this._movies.length > 5) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }

    this._renderTopRatedMovies(topRatedList);
    this._renderMostCommentedMovies(mostCommentedList);
  }

  _renderNoMoviesPlumber() {
    render(this._filmListContainerElement, this._noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
    this._filmTopRatedElement.parentElement.classList.add(HIDDEN_CLASS);
    this._filmMostCommentedElement.parentElement.classList.add(HIDDEN_CLASS);
  }

  _updateMovies() {
    const movies = this._moviesModel.getMovies();
    this._removeMovies();
    this._renderMovies(movies.slice(0, SHOWING_CARD.ON_START));
    if (movies.length > 2) {
      this._renderShowMoreButton();
    }
  }

  _updateMovieInterface(commentsListElement) {
    this._removeOldMoviesData();
    this._renderNewMoviesData();
    const commentsList = commentsListElement;
    commentsList.innerHTML = ``;
  }

  _updateUserRank() {
    this._movies = this._moviesModel.getMovies();
    const watchedMoviesLength = getWatchedMovies(this._movies).length;
    Promise.resolve(this._userRankComponent.setUserRank(watchedMoviesLength))
    .then(()=> {
      this._userRankComponent.rerender();
    });
  }

  _updateTopRatedFilms(movies) {
    this._filmTopRatedElement.parentElement.classList.remove(HIDDEN_CLASS);
    return getTopRatedFilms(movies);
  }

  _updateMostCommentedFilms(movies) {
    this._filmMostCommentedElement.parentElement.classList.remove(HIDDEN_CLASS);
    return getMostCommentedFilms(movies);
  }

  _onCommentsCountChange(movieController, oldData, newData, commentIndex, commentsListElement, commentData) {
    if (newData === null) {
      const oldMovie = oldData.getCard();
      const currentDeletingComment = movieController.getCurrentDeletingComment();
      this._api.deleteComment(commentIndex, oldMovie)
        .then(() => {
          this._moviesModel.deleteComment(oldMovie.id, commentIndex);

          this._updateMovieInterface(commentsListElement);
          this._renderNewPopupData(movieController, oldMovie, commentsListElement);
          currentDeletingComment.setDeleteButtonUnlocked();
        })
        .catch(() => {
          movieController.shake();
          currentDeletingComment.setData({
            deleteButtonText: `Delete`,
          });
          currentDeletingComment.setDeleteButtonUnlocked();
        });
    }

    if (oldData === null) {
      const creatingNewCommentForm = movieController.getCreatingNewCommentForm();
      const newMovie = newData.getCard();
      const newComment = commentData;
      const bigEmojiContainer = movieController.getEmptyEmojiContainer();

      this._api.createComment(newMovie.id, newComment)
        .then((updatedComment) => {
          this._moviesModel.addComment(newMovie.id, updatedComment);

          this._updateMovieInterface(commentsListElement);
          this._renderNewPopupData(movieController, newMovie, commentsListElement);

          creatingNewCommentForm.removeAttribute(`disabled`);
          creatingNewCommentForm.value = ``;
          bigEmojiContainer.classList.add(`visually-hidden`);
        })
        .catch(() => {
          movieController.shake(movieController);
          creatingNewCommentForm.removeAttribute(`disabled`);
          movieController.newCommentDeliveryError(creatingNewCommentForm);
        });
    }
    return true;
  }

  _onDataChange(movieController, oldData, newData) {
    this._api.updateMovie(oldData.id, newData)
      .then((updatedMovie) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, updatedMovie);

        this._updateUserRank();

        this._api.getComments(updatedMovie.id)
        .then((value) => {
          updatedMovie.comments = value;
          if (isSuccess) {
            this._updateMovies();
          }
        });
      });
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = this._movies.slice().sort((a, b) => a.filmInfo.release.year - b.filmInfo.release.year);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = this._movies.slice().sort((a, b) => parseInt(a.filmInfo.totalRating, 10) - parseInt(b.filmInfo.totalRating, 10));
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
    const movies = this._moviesModel.getMovies();
    showingCardCount = showingCardCount + SHOWING_CARD.COUNT_BY_BUTTON;

    this._renderMovies(movies.slice(prevCardCount, showingCardCount));

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
    showingCardCount = SHOWING_CARD.ON_START;

    const movies = this._moviesModel.getMovies();

    this._removeOldMoviesData();
    if (movies.length > 0) {
      const topRatedList = this._updateTopRatedFilms(movies);
      const mostCommentedList = this._updateMostCommentedFilms(movies);

      this._renderFilteredMovies(movies, topRatedList, mostCommentedList);
      this._filterController.render(this._currentFilterTargetElement);
    } else {
      this._renderNoMoviesPlumber();
    }
  }

  _onStatisticsFilterChange(statisticFilterType) {
    event.preventDefault();
    switch (statisticFilterType) {
      case StatisticFilterId.ALL_TIME:
        this._statisticsComponent.renderStatistics(StatisticFilterId.ALL_TIME);
        break;
      case StatisticFilterId.TODAY:
        this._statisticsComponent.renderStatistics(StatisticFilterId.TODAY);
        break;
      case StatisticFilterId.WEEK:
        this._statisticsComponent.renderStatistics(StatisticFilterId.WEEK);
        break;
      case StatisticFilterId.MONTH:
        this._statisticsComponent.renderStatistics(StatisticFilterId.MONTH);
        break;
      case StatisticFilterId.YEAR:
        this._statisticsComponent.renderStatistics(StatisticFilterId.YEAR);
        break;
    }
  }

  _onEmojiChange(emojiType, bigEmojiContainer) {
    switch (emojiType) {
      case EmojiId.SMILE.ID:
        bigEmojiContainer.src = EmojiId.SMILE.SRC;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EmojiId.SMILE.VALUE;
      case EmojiId.SLEEPING.ID:
        bigEmojiContainer.src = EmojiId.SLEEPING.SRC;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EmojiId.SLEEPING.VALUE;
      case EmojiId.GRINNING.ID:
        bigEmojiContainer.src = EmojiId.GRINNING.SRC;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EmojiId.GRINNING.VALUE;
      case EmojiId.ANGRY.ID:
        bigEmojiContainer.src = EmojiId.ANGRY.SRC;
        bigEmojiContainer.classList.remove(`visually-hidden`);
        return EmojiId.ANGRY.VALUE;
    }
    return emojiType;
  }
}
