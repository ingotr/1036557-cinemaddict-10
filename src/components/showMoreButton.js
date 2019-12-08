import AbstractComponent from './abstractComponent.js';

const createShowMoreButton = () => `<button class="films-list__show-more">Show more</button>`;

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButton();
  }
}
