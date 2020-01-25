import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => this._store.setItem(movie.id. movie.toRaw()));
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getAll());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  updateMovie(movieId, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(movieId, data)
      .then((newMovie) => {
        this._store.setItem(newMovie.movieId, newMovie.toRa());
        return newMovie;
      });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, data.toRaw(), {movieId}));

    this._store.setItem(movieId, Object.assign({}, fakeUpdatedMovie.toRaw(), {offline: true}));

    return Promise.resolve(data);
  }

  syncMovies() {
    return this._api.syncMovies();
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId)
      .then((comments) => {
        comments.forEach((comment) => {
          this._store.setItem(comment.id, comment.toRAW());
        });
        return comments;
      });
    }

    const storeComments = Object.values(this._store.getAll());

    return Promise.resolve(Comment.parseComments(storeComments));
  }

  createComment(movieId, data) {
    if (this._isOnline()) {
      return this._api.createComment(movieId, data)
      .then((newComment) => {
        this._store.setItem(newComment, newComment.toRAW());
        return newComment;
      });
    }

    const fakeNewCommentId = new Date().toDateString();
    const fakeNewComment = Comment.parseComment(Object.assign({}, data.toRAW(), {id: fakeNewCommentId}));

    this._store.setItem(fakeNewComment.id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId)
      .then(() => {
        this._store.removeItem(commentId);
      });
    }

    this._store.removeItem(commentId);

    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

