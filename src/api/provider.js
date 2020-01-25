export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    return this._api.getMovies();
  }

  updateMovie() {
    return this._api.updateMovie();
  }

  syncMovies() {
    return this._api.syncMovies();
  }

  getComments() {
    return this._api.getComments();
  }

  createComment() {
    return this._api.createComment();
  }

  deleteComment() {
    return this._api.deleteComment();
  }
}

