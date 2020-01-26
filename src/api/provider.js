import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store, commentStore) {
    this._api = api;
    this._store = store;
    this._storeComments = commentStore;
    this._isSynchronized = true;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => this._store.setItem(movie.id, movie.toRaw()));
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getAll());

    this._isSynchronized = false;

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

    this._isSynchronized = false;

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
        this._storeComments.setItem(movieId, Object.assign({}, Object.values(comments)));

        return comments;
      });
    }

    const storeComments = Object.values(this._storeComments.getAll());
    const commentByMovieId = Object.values(storeComments[movieId]);

    this._isSynchronized = false;

    return Promise.resolve(Comment.parseComments(commentByMovieId));
  }

  createComment(movieId, data) {
    const storeComments = Object.values(this._storeComments.getAll());
    const commentByMovieId = Object.values(storeComments[movieId]);

    if (this._isOnline()) {
      return this._api.createComment(movieId, data)
      .then((newComment) => {
        this._storeComments.setItem(movieId, Object.assign({}, commentByMovieId, newComment.toRAW()));
        return newComment;
      });
    }

    const fakeNewCommentId = new Date().toDateString();
    const fakeNewCommentAuthor = `offlineComment`;
    const newOfflineComment = {
      'id': fakeNewCommentId,
      'author': fakeNewCommentAuthor,
      'comment': data.comment,
      'date': data.date,
      'emotion': data.emotion,
    };

    const fakeNewComment = Comment.parseComment(Object.assign({}, newOfflineComment));
    let commentsWithNewComment = commentByMovieId;
    commentsWithNewComment.push(newOfflineComment);

    this._isSynchronized = false;

    this._storeComments.setItem(movieId, commentsWithNewComment);

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(commentId, movie) {
    const currentMovie = movie;
    const movieId = currentMovie.id;
    const commentIndex = currentMovie.comments.findIndex((it) => it.id === commentId);

    const movieComments = [].concat(currentMovie.comments.slice(0, commentIndex),
        currentMovie.comments.slice(commentIndex + 1));

    if (this._isOnline()) {
      return this._api.deleteComment(commentId)
      .then(() => {
        this._storeComments.setItem(movieId, Object.assign({}, Object.values(movieComments)));
      });
    }

    this._isSynchronized = false;

    this._storeComments.setItem(movieId, Object.assign({}, Object.values(movieComments)));

    return Promise.resolve();
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

