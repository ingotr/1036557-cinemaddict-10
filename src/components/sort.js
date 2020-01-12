import AbstractComponent from './abstract-component.js';

export const SortType = {
  DATE_DOWN: `date-down`,
  RATING_DOWN: `rating-down`,
  DEFAULT: `default`,
};

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE_DOWN}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortElements = evt.currentTarget.querySelectorAll(`.sort__button`);
      this._deactivateAllSortElements(sortElements);

      const sortType = evt.target.dataset.sortType;

      evt.target.classList.add(`sort__button--active`);

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }

  _deactivateAllSortElements(sortElements) {
    for (const element in sortElements) {
      if (sortElements.hasOwnProperty(element)) {
        sortElements[element].classList.remove(`sort__button--active`);
      }
    }
  }
}
