import FilterComponent, {MenuItem} from '../components/main-menu.js';
import {FilterType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getMoviesByFilter, getWatchedMovies} from '../utils/filter.js';

const GENRES = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Biography`,
  `Comedy`];

export default class FilterController {
  constructor(container, moviesModel, statisticsComponent, pageController) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._statisticsComponent = statisticsComponent;
    this._pageController = pageController;

    this._movies = this._moviesModel.getMovies();
    this._watchedMovies = getWatchedMovies(this._movies);

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onMenuChange = this._onMenuChange.bind(this);

    this._moviesModel.setDataChangeHandlers(this._onDataChange);
  }

  render() {
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

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange, this._onMenuChange);


    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }

    console.log(`all watched movies`, this._watchedMovies);

    console.table(this._getStatisticsData());

    // console.log(`total watched runtime ${this._getTotalMoviesRuntime()}`);
  }

  // _getTotalMoviesRuntime() {
  //   const watchedMovies = this._watchedMovies;
  //   let totalRuntime = 0;
  //   watchedMovies.forEach((movie) => {
  //     totalRuntime += movie.duration;
  //   });

  //   return totalRuntime;
  // }

  _getStatisticsData() {
    let moviesStatistics = [];
    GENRES.map((genre) => {
      let count = this._getMoviesByGenre(genre).length;
      moviesStatistics.push(this._getMovieStatisticElement(genre, count));
    });
    return moviesStatistics;
  }

  _getMovieStatisticElement(genre, count) {
    return {
      label: genre,
      movieCount: count,
    };
  }

  _getMoviesByGenre(genre) {
    const moviesByGenre = this._watchedMovies.filter((film) => film.genres.includes(genre));
    return moviesByGenre;
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._onDataChange();
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
        // mainMenuComponent.setActiveItem(MenuItem.STATS);
        pageController.hide();
        statistics.show();
        break;
    }
  }
}
