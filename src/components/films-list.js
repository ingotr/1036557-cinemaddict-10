import AbstractComponent from './abstract-component.js';

const filmListVisuallyHidden = `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
const filmsSectionClass = `films-list`;

const createFilmsListTemplate = (classTitle = filmsSectionClass, title = filmListVisuallyHidden) => (
  `<section class="${classTitle}">
    ${title}
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsList extends AbstractComponent {
  constructor(classTitle = filmsSectionClass, title = filmListVisuallyHidden) {
    super();

    this._classTitle = classTitle;
    this._title = title;
  }

  getTemplate() {
    return createFilmsListTemplate(this._classTitle, this._title);
  }
}
