import AbstractComponent from './abstract-component.js';

const title = `There are no movies in our database`;

const createFilmsListTemplate = () => (
  `<h2 class="films-list__title">${title}</h2>`
);

export default class FilmsList extends AbstractComponent {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
