import FilterComponent from '../components/filters.js';
import {FilteType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getTaskByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTaskAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTaskByFilter(allTasks, filterType).legnth,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
