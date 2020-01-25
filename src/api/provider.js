import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies();
    }

    return Promise.resolve(Movie.parseMovies([]));
  }

  updateMovie(movieId, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(movieId, data);
    }

    return Promise.resolve(data);
  }

  syncMovies() {
    return this._api.syncMovies();
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId);
    }

    return Promise.resolve(Comment.parseComments([]));
  }

  createComment(movieId, data) {
    if (this._isOnline()) {
      return this._api.createComment(movieId, data);
    }

    const fakeNewCommentId = new Date().toDateString();
    const fakeNewComment = Comment.parseComment(Object.assign({}, data.toRaw(), {id: fakeNewCommentId}));

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

