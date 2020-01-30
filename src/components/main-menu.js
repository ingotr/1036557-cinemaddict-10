import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';

export const MenuItem = {
  ALL: `all movies`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`,
};

const getCurrentFilterClass = (filtersClassBuffer, targetFilterType, filterClass) => {
  switch (targetFilterType) {
    case FilterType.ALL:
      filtersClassBuffer.ALL = filterClass;
      break;
    case FilterType.WATCHLIST:
      filtersClassBuffer.WATCHLIST = filterClass;
      break;
    case FilterType.HISTORY:
      filtersClassBuffer.HISTORY = filterClass;
      break;
    case FilterType.FAVORITES:
      filtersClassBuffer.FAVORITES = filterClass;
      break;
    case FilterType.STATS:
      filtersClassBuffer.STATS = filterClass;
      break;
  }
};

const createMainMenuTemplate = (filters, currentFilterTarget) => {
  const [watchlist, history, favorites] = filters;
  const filterTarget = currentFilterTarget;

  let FiltersClassBuffer = {
    ALL: ``,
    WATCHLIST: ``,
    HISTORY: ``,
    FAVORITES: ``,
    STATS: ``,
  };

  if (currentFilterTarget !== null) {
    const targetFilterType = filterTarget.dataset.filterType;
    const filterClass = filterTarget.classList;

    getCurrentFilterClass(FiltersClassBuffer, targetFilterType, filterClass);
  }

  return (
    `<nav class="main-navigation">
      <a id="#all movies" href="#all movies" data-filter-type="${FilterType.ALL}" class="main-navigation__item ${FiltersClassBuffer.ALL}">All movies</a>
      <a id="#watchlist" href="#watchlist" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item ${FiltersClassBuffer.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
      <a id="#history" href="#history" data-filter-type="${FilterType.HISTORY}" class="main-navigation__item ${FiltersClassBuffer.HISTORY}">History <span class="main-navigation__item-count">${history.count}</span></a>
      <a id="#favorites" href="#favorites" data-filter-type="${FilterType.FAVORITES}" class="main-navigation__item ${FiltersClassBuffer.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
      <a id="#stats" href="#stats" class="main-navigation__item main-navigation__item--additional ${FiltersClassBuffer.STATS}">Stats</a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  constructor(filters, onFilterChange, currentFilterTarget) {
    super();

    this._filters = filters;
    this._activeFilterType = FilterType.ALL;
    this._onFilterChange = onFilterChange;
    this._currentFilterTarget = currentFilterTarget;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters, this._currentFilterTarget);
  }

  setFilterChangeHandler(menuClickHandler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      let menuItem = evt.target.id.slice(1);

      const filterElements = evt.currentTarget.
        querySelectorAll(`a:not(.main-navigation__item--additional)`);
      this._deactivateAllFilterElements(filterElements);

      const filterType = evt.target.dataset.filterType;

      evt.target.classList.add(`main-navigation__item--active`);

      this._activeFilterType = filterType;

      this._onFilterChange(this._activeFilterType, evt.target);

      menuClickHandler(menuItem);
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
