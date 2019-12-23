import AbstractComponent from './abstract-component.js';

const createMainMenuTemplate = (filters) => {
  const [watchlist, history, favorites] = filters;
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createMainMenuTemplate(this._count);
  }
}
