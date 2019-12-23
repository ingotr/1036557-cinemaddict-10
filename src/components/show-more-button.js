import AbstractComponent from './abstract-component.js';

const createShowMoreButton = () => `<button class="films-list__show-more">Show more</button>`;

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButton();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
