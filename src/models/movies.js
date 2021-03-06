import CommentComponent from '../components/comment.js';
import {getMoviesByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this.setFilter.bind(this);

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  getActiveFilter() {
    return this._activeFilterType;
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandlers(handler) {
    this._filterChangeHandlers.push(handler);
  }

  updateMovie(movieId, newMovie) {
    const index = this._movies.findIndex((movie) => movie.id === movieId);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newMovie,
        this._movies.slice(index + 1));

    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  deleteComment(movieId, commentId) {
    const index = this._movies.findIndex((movie) => movie.id === movieId);
    if (index === -1) {
      return false;
    }

    const commentIndex = this._movies[index].comments.findIndex((comment) => comment.id === commentId);

    this._movies[index].comments = [].concat(this._movies[index].comments.slice(0, commentIndex),
        this._movies[index].comments.slice(commentIndex + 1));

    this._dataChangeHandlers.forEach((handler) => handler());

    return this._movies[index];
  }

  addComment(movieId, commentData) {
    const index = this._movies.findIndex((movie) => movie.id === movieId);
    if (index === -1) {
      return false;
    }

    const newComment = new CommentComponent(commentData);

    let moviesCommentList = this._movies[index];
    moviesCommentList = [].concat(moviesCommentList.comments.unshift(newComment.getCommentData()));

    this._dataChangeHandlers.forEach((handler) => handler());

    return moviesCommentList;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
