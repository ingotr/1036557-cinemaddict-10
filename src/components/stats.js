import AbstractComponent from './abstract-component.js';

const createStatsTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__item
     main-navigation__item--additional">Stats</a>`
  );
};

export default class Stats extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatsTemplate();
  }
}
