import AbstractComponent from './abstract-component.js';

const FILMLIST_VISUALLY_HIDDEN_MARKUP = `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
const FILMLIST_SECTION_CLASS = `films-list`;

const createFilmsListTemplate = (classTitle = FILMLIST_SECTION_CLASS, title = FILMLIST_VISUALLY_HIDDEN_MARKUP) => (
  `<section class="${classTitle}">
    ${title}
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsList extends AbstractComponent {
  constructor(classTitle = FILMLIST_SECTION_CLASS, title = FILMLIST_VISUALLY_HIDDEN_MARKUP) {
    super();

    this._classTitle = classTitle;
    this._title = title;
  }

  getTemplate() {
    return createFilmsListTemplate(this._classTitle, this._title);
  }
}
