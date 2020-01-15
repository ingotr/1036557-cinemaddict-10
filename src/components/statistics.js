import AbstractComponent from './abstract-component.js';
import Chart from 'chart.js';
import ChartJsDatalabels from 'chartjs-plugin-datalabels';
import {getWatchedMovies} from '../utils/filter.js';
import {GenreItems} from '../const.js';
import {getFormattedRuntime, getCurrentDate, getTimeDuration} from '../utils/common.js';

const createStatisticTextListMarkup = (userStatistics) => {
  const {favGenre, totalMoviesDuration, genresList, watchedMoviesCount} = userStatistics;
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
    const userStatistics = this.getUserStatistics(this._movies);
    return createStatisticsTemplate(userStatistics);
  }

  getUserStatistics(movies) {
    const favoriteGenre = this._getFavoriteGenre();
    const totalMoviesRuntime = this._getTotalMoviesRuntime();
    let mostWatchedGenres = this._getStatisticsData(movies);

    console.table(`most watched genres`, mostWatchedGenres);
    console.table(`total Runtime`, totalMoviesRuntime);
    console.log(`most popular genre`, favoriteGenre);

    return {
      favGenre: favoriteGenre,
      totalMoviesDuration: totalMoviesRuntime,
      genresList: mostWatchedGenres,
      watchedMoviesCount: this._watchedMovies.length,
    };
  }

  renderStatistics(statisticFilterChoice) {
    if (statisticFilterChoice === STATISTIC_FILTERS_ID.ALL_TIME) {
      moviesList = this._movies;
    } else {
      moviesList = this._getMoviesByBetweenDates(this._movies, durationTime, durationUnit);
    }
    const moviesList = this._getMoviesByBetweenDates(this._movies, durationTime, durationUnit);
    const userStatistics = this.getUserStatistics(moviesList);

    this._renderStatisticsCharts(userStatistics.genresList);
  }

  setStatisticsFiltersHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, handler);
  }

  _renderStatisticsCharts(list) {
    let ctx = document.querySelector(`.statistic__chart`);
    const genreList = list;

    Chart.defaults.global.defaultFontSize = 20;
    let myChart = new Chart(ctx, {
      type: `horizontalBar`,
      plugins: [ChartJsDatalabels],
      data: {
        labels: [
          `${genreList[0].label}`,
          `${genreList[1].label}`,
          `${genreList[2].label}`,
          `${genreList[3].label}`,
          `${genreList[4].label}`,
        ],
        datasets: [{
          label: `test`,
          data: [
            genreList[0].movieCount,
            genreList[1].movieCount,
            genreList[2].movieCount,
            genreList[3].movieCount,
            genreList[4].movieCount],
          backgroundColor: `rgba(255, 232, 0, 1)`,
          barThickness: 20,
          maxBarThickness: 30,
          labels: {
            display: false,
          },
          datalabels: {
            anchor: `start`,
            align: `start`,
            color: `white`,
            display: true,
            font: {
              size: 16,
            },
            padding: 10,
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
          }],
        },
      }
    });
  }

  _getFavoriteGenre(movies) {
    return this._getStatisticsData(movies)[0].label;
  }

  _getTotalMoviesRuntime() {
    const watchedMovies = this._watchedMovies;
    let totalMinutes = 0;
    watchedMovies.forEach((movie) => {
      totalMinutes += movie.duration;
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
    mostWatchedGenreList = mostWatchedGenreList.slice(0, 5);

    return mostWatchedGenreList;
  }

  _getMovieStatisticElement(genre, count) {
    return {
      label: genre,
      movieCount: count,
    };
  }

  _getDeltaTime() {

    return deltaTime;
  }

  _getMoviesByBetweenDates(movies, durationTime, durationUnit) {
    const moviesList = movies;
    const endDate = getCurrentDate();
    console.log(endDate);

    const startDate = getTimeDuration(endDate, durationTime, durationUnit);
    console.log(startDate);

    let moviesByDates = [];

    moviesByDates = moviesList.filter((film) =>
      (film.watchingDate > startDate && film.watchingDate < endDate));

    return moviesByDates;
  }

  _getMoviesByGenre(movies, genre) {
    const moviesByGenre = movies.filter((film) => film.genres.includes(genre));
    return moviesByGenre;
  }
}
