import Movie from './models/movie.js';
import Comment from './models/comment.js';

const METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `/movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: METHOD.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  syncMovies() {
  }

  getComments(movieId) {
    return this._load({url: `/comments/${movieId}`})
      .then((response) => response.json())
      .then(Comment.parseComments)
      .then((comments) => {
        return comments;
      });
  }

  postComments() {
  }

  deleteComments() {
  }

  _load({url, method = METHOD.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

};

export default API;
