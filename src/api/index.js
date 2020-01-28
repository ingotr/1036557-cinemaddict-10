import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ServerResponseStatus = {
  OK: 200,
  MULTIPLE_CHOICE: 300,
};

const checkStatus = (response) => {
  if (response.status >= ServerResponseStatus.OK && response.status < ServerResponseStatus.MULTIPLE_CHOICE) {
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

  updateMovie(movieId, movie) {
    return this._load({
      url: `/movies/${movieId}`,
      method: Method.PUT,
      body: JSON.stringify(movie.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  syncMovies(movies) {
    return this._load({
      url: `/movies/syns`,
      method: Method.POST,
      body: JSON.stringify(movies),
      header: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  getComments(movieId) {
    return this._load({url: `/comments/${movieId}`})
      .then((response) => response.json())
      .then(Comment.parseComments)
      .then((comments) => {
        return comments;
      });
  }

  createComment(movieId, comment) {
    return this._load({
      url: `/comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Comment.parseComment);
  }

  deleteComment(commentId) {
    return this._load({url: `/comments/${commentId}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

};

export default API;
