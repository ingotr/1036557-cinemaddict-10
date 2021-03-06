import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const getSyncedMovies =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.movie);

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

  updateMovie(movieId, movie) {
    if (this._isOnline()) {
      return this._api.updateMovie(movieId, movie)
      .then((newMovie) => {
        this._store.setItem(newMovie.movieId, newMovie.toRaw());
        return newMovie;
      });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, movie.toRaw(), {movieId}));

    this._isSynchronized = false;

    this._store.setItem(movieId, Object.assign({}, fakeUpdatedMovie.toRaw(), {offline: true}));

    return Promise.resolve(movie);
  }

  syncMovies() {
    if (this._isOnline()) {
      const storeMovies = Object.values(this._store.getAll());

      return this._api.syncMovies(storeMovies)
        .then((response) => {
          storeMovies.filter((movie) => movie.offline).forEach((movie) => {
            this._store.removeItem(movie.id);
          });

          const createdMovies = getSyncedMovies(response.created);
          const updatedMovies = getSyncedMovies(response.updated);

          [...createdMovies, ...updatedMovies].forEach((movie) => {
            this._store.setItem(movie.id, movie);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
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

  createComment(movieId, comment) {
    const storeComments = Object.values(this._storeComments.getAll());
    const commentByMovieId = Object.values(storeComments[movieId]);

    if (this._isOnline()) {
      return this._api.createComment(movieId, comment)
      .then((newComment) => {
        this._storeComments.setItem(movieId, Object.assign({}, commentByMovieId, newComment));
        return Promise.resolve(newComment);
      });
    }

    const fakeNewCommentId = new Date().toDateString();
    const fakeNewCommentAuthor = `offlineComment`;
    const newOfflineComment = {
      'id': fakeNewCommentId,
      'author': fakeNewCommentAuthor,
      'comment': comment.comment,
      'date': comment.date,
      'emotion': comment.emotion,
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

