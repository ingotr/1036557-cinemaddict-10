import AbstractComponent from './abstract-component.js';

const TITLE = `There are no movies in our database`;

const createFilmsListTemplate = () => (
  `<h2 class="films-list__title">${TITLE}</h2>`
);

export default class FilmsList extends AbstractComponent {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
