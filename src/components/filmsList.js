import {createElement} from '../utils.js';

const filmListVisuallyHidden = `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
const filmsSectionClass = `films-list`;

const createFilmsListTemplate = (classTitle = filmsSectionClass, title = filmListVisuallyHidden) => (
  `<section class="${classTitle}">
    ${title}
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsList {
  constructor(classTitle = filmsSectionClass, title = filmListVisuallyHidden) {
    this._classTitle = classTitle;
    this._title = title;

    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._classTitle, this._title);
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
