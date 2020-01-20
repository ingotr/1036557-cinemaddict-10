const MOVIES_METHOD = {
  GET: `GET`,
  SYNC: `POST`,
  PUT: `PUT`,
};

const COMMENTS_METHOD = {
  GET: `GET`,
  POST: `POST`,
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
  }

  putMovies() {
  }

  syncMovies() {
  }

  getComments() {
  }

  postComments() {
  }

  deleteComments() {
  }

};

export default API;
