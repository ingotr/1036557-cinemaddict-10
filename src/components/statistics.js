import AbstractComponent from './abstract-component.js';
import Chart from 'chart.js';
import ChartJsDatalabels from 'chartjs-plugin-datalabels';
import {getWatchedMovies} from '../utils/filter.js';
import {GenreItems, STATISTIC_FILTERS_ID} from '../const.js';
import {getFormattedRuntime, getCurrentDate, getTimeDuration} from '../utils/common.js';
import moment from 'moment';

const CHART_DEFAULT_FONT_SIZE = 20;
const FIRST_FIVE_GENRES = 5;
const StatisticFilterRange = {
  TODAY: 1,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365,
};

const createStatisticTextListMarkup = (userStatistics) => {
  const {favGenre, totalMoviesDuration, watchedMoviesCount} = userStatistics;
  return (
    `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalMoviesDuration.hours} <span class="statistic__item-description">h</span>
        ${totalMoviesDuration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${favGenre}</p>
      </li>
    </ul>`
  );
};

const createStatisticsTemplate = (userStatistics) => {
  const textList = createStatisticTextListMarkup(userStatistics);
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      ${textList}

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000" height="300"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;

    this._movies = this._moviesModel.getMovies();
    this._watchedMovies = getWatchedMovies(this._movies);
  }

  getTemplate() {
    const userStatistics = this.getUserStatistics(this._watchedMovies);
    return createStatisticsTemplate(userStatistics);
  }

  getUserStatistics(movies) {
    let favoriteGenre = this._getFavoriteGenre(movies);
    let totalMoviesRuntime = this._getTotalMoviesRuntime();
    let mostWatchedGenres = this._getStatisticsData(movies);

    if (favoriteGenre === ``) {
      favoriteGenre = `«-»`;
    }

    if (totalMoviesRuntime <= 0) {
      totalMoviesRuntime = 0;
    }

    return {
      favGenre: favoriteGenre,
      totalMoviesDuration: totalMoviesRuntime,
      genresList: mostWatchedGenres,
      watchedMoviesCount: this._watchedMovies.length,
    };
  }

  renderStatistics(statisticFilterChoice) {
    let moviesList = this._watchedMovies;

    if (statisticFilterChoice !== STATISTIC_FILTERS_ID.ALL_TIME) {
      switch (statisticFilterChoice) {
        case STATISTIC_FILTERS_ID.TODAY:
          moviesList = this._getMoviesByBetweenDates(this._watchedMovies, StatisticFilterRange.TODAY, `day`);
          break;
        case STATISTIC_FILTERS_ID.WEEK:
          moviesList = this._getMoviesByBetweenDates(this._watchedMovies, StatisticFilterRange.WEEK, `days`);
          break;
        case STATISTIC_FILTERS_ID.MONTH:
          moviesList = this._getMoviesByBetweenDates(this._watchedMovies, StatisticFilterRange.MONTH, `days`);
          break;
        case STATISTIC_FILTERS_ID.YEAR:
          moviesList = this._getMoviesByBetweenDates(this._watchedMovies, StatisticFilterRange.YEAR, `days`);
          break;
      }
    }

    const userStatistics = this.getUserStatistics(moviesList);
    let ctx = document.querySelector(`.statistic__chart`);

    if (moviesList.length > 0) {
      ctx.classList.remove(`visually-hidden`);
      this._renderStatisticsCharts(userStatistics.genresList);
    } else {
      ctx.classList.add(`visually-hidden`);
    }
  }

  setStatisticsFiltersHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, handler);
  }

  _renderStatisticsCharts(list) {
    let ctx = document.querySelector(`.statistic__chart`);
    const genreList = list;

    Chart.defaults.global.defaultFontSize = CHART_DEFAULT_FONT_SIZE;
    let myChart = new Chart(ctx, {
      type: `horizontalBar`,
      plugins: [ChartJsDatalabels],
      data: {
        labels: [`${genreList[0].label}`,
          `${genreList[1].label}`,
          `${genreList[2].label}`,
          `${genreList[3].label}`,
          `${genreList[4].label}`],
        datasets: [{
          data: [
            genreList[0].movieCount,
            genreList[1].movieCount,
            genreList[2].movieCount,
            genreList[3].movieCount,
            genreList[4].movieCount],
          backgroundColor: `rgba(255, 232, 0, 1)`,
          barThickness: 20,
          maxBarThickness: 30,
          datalabels: {
            anchor: `start`,
            align: `start`,
            color: `white`,
            display: true,
            font: {
              size: 16,
            },
            padding: 6,
          }
        }],
      },
      options: {
        plugins: {
          datalabels: {
            formatter(value, context) {
              return context.chart.data.labels[context.dataIndex] + `   ` + value;
            }
          }
        },
        legend: {
          display: false,
        },
        scales: {
          display: false,
          xAxes: [{
            gridLines: {
              display: false,
            },
            display: false,
            ticks: {
              display: false,
              beginAtZero: true,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: `transparent`,
            },
          }],
        },
      }
    });
    return myChart;
  }

  _getFavoriteGenre(movies) {
    return this._getStatisticsData(movies)[0].label;
  }

  _getTotalMoviesRuntime() {
    const watchedMovies = this._watchedMovies;
    let totalMinutes = 0;
    watchedMovies.forEach((movie) => {
      totalMinutes += movie.filmInfo.runtime;
    });

    const totalRuntime = getFormattedRuntime(totalMinutes);

    return totalRuntime.digits;
  }

  _getStatisticsData(movies) {
    let moviesStatistics = [];
    GenreItems.map((genre) => {
      let count = this._getMoviesByGenre(movies, genre).length;
      moviesStatistics.push(this._getMovieStatisticElement(genre, count));
    });

    let mostWatchedGenreList = moviesStatistics.sort((a, b) => b.movieCount - a.movieCount);

    mostWatchedGenreList = mostWatchedGenreList.slice(0, FIRST_FIVE_GENRES);

    return mostWatchedGenreList;
  }

  _getMovieStatisticElement(genre, count) {
    return {
      label: genre,
      movieCount: count,
    };
  }

  _getMoviesByBetweenDates(movies, durationTime, durationUnit) {
    const moviesList = movies;
    const endDate = getCurrentDate();

    const startDate = getTimeDuration(endDate, durationTime, durationUnit);

    let moviesByDates = [];

    moviesByDates = moviesList.filter((film) => {
      const watchingDate = film.userDetails.watchingDate;
      const isBetween = moment(watchingDate).isBefore(endDate) && moment(watchingDate).isAfter(startDate);
      return isBetween;
    });
    return moviesByDates;
  }

  _getMoviesByGenre(movies, genres) {
    const moviesByGenre = movies.filter((film) => {
      return film.filmInfo.genre.includes(genres);
    });
    return moviesByGenre;
  }
}
