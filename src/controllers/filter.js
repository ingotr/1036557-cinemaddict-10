import FilterComponent, {MenuItem} from '../components/main-menu.js';
import {FilterType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getMoviesByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, moviesModel, statisticsComponent, pageController, currentFilterTargetElement) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._statisticsComponent = statisticsComponent;
    this._pageController = pageController;

    this._movies = this._moviesModel.getMovies();

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._currentFilterTargetElement = currentFilterTargetElement;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onMenuChange = this._onMenuChange.bind(this);
  }

  render(currentFilterTargetElement = null) {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters, this._onFilterChange, currentFilterTargetElement);
    this._filterComponent.setFilterChangeHandler(this._onMenuChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType, target) {
    this._moviesModel.onFilterChange(filterType);
    this._pageController.setCurrentFilterTarget(target);
    this._currentFilterTargetElement = target;
    this.render(target);
  }

  _onMenuChange(menuItem) {
    const statistics = this._statisticsComponent;
    const pageController = this._pageController;
    switch (menuItem) {
      case MenuItem.ALL:
      case MenuItem.WATCHLIST:
      case MenuItem.HISTORY:
      case MenuItem.FAVORITES:
        statistics.hide();
        pageController.show();
        break;
      case MenuItem.STATS:
        pageController.hide();
        statistics.show();
        break;
    }
  }
}
