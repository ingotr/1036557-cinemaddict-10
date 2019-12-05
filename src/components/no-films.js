import {createElement} from '../utils.js';

const title = `There are no movies in our database`;

const createFilmsListTemplate = () => (
  `<h2 class="films-list__title">${title}</h2>`
);

export default class FilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
