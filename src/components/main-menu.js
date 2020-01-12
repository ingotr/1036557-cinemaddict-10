import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';

export const MenuItem = {
  ALL: `all movies`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`,
};

const createMainMenuTemplate = (filters) => {
  const [watchlist, history, favorites] = filters;
  return (
    `<nav class="main-navigation">
      <a href="#all movies" data-filter-type="${FilterType.ALL}" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
      <a href="#history" data-filter-type="${FilterType.HISTORY}" class="main-navigation__item">History <span class="main-navigation__item-count">${history.count}</span></a>
      <a href="#favorites" data-filter-type="${FilterType.FAVORITES}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
    this._activeFilterType = FilterType.ALL;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterElements = evt.currentTarget.
      querySelectorAll(`a:not(main-navigation__item--additional)`);
      this._deactivateAllFilterElements(filterElements);

      evt.target.classList.add(`main-navigation__item--active`);

      const filterType = evt.target.dataset.filterType;

      if (this._activeFilterType === filterType) {
        return;
      }

      this._activeFilterType = filterType;

      handler(this._activeFilterType);
    });
  }

  _deactivateAllFilterElements(filterElements) {
    for (const element in filterElements) {
      if (filterElements.hasOwnProperty(element)) {
        filterElements[element].classList.remove(`main-navigation__item--active`);
      }
    }
  }
}
