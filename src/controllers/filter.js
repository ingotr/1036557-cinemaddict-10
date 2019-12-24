import FilterComponent from '../components/filters.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
