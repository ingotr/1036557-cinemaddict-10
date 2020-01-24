import AbstractComponent from './abstract-component.js';

const START_TITLE = `Loading...`;

const createFilmsTemplate = () => (
  `<section class="films">
    <h2 class="films-list__title">${START_TITLE}</h2>
  </section>`
);

export default class Films extends AbstractComponent {
  getTemplate() {
    return createFilmsTemplate();
  }

  hideLoadingTitle(target) {
    const title = target.getElement().querySelector(`.films-list__title`);
    title.classList.add(`visually-hidden`);
  }
}

