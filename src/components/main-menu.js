import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';

const createMainMenuTemplate = (filters) => {
  const [watchlist, history, favorites] = filters;
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
    this._currentFilterType = FilterType.ALL;
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
      querySelectorAll(`a:not(.main-navigation__item--additional)`);
      this._deactivateAllFilterElements(filterElements);

      evt.target.classList.add(`main-navigation__item--active`);

      if (this._currentSortType === FilterType) {
        return;
      }

      this._currentSortType = FilterType;

      handler(this._currentSortType);
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
