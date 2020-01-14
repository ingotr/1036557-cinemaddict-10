import AbstractComponent from './abstract-component.js';
import Chart from 'chart.js';
import ChartJsDatalabels from 'chartjs-plugin-datalabels';
import {getWatchedMovies } from '../utils/filter.js';
import {GenreItems} from '../const.js';
import {getFormattedRuntime} from '../utils/common.js';

const createStatisticsTemplate = () => {
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

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">22 <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">130 <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">Sci-Fi</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
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
    this.getUserStatistics();

    return createStatisticsTemplate();
  }

  getUserStatistics() {
    const favoriteGenre = this._getFavoriteGenre();
    const totalMoviesRuntime = this._getTotalMoviesRuntime();
    const mostWatchedGenres = this._getStatisticsData();

    console.table(`most watched genres`, mostWatchedGenres);
    console.table(`total Runtime`, totalMoviesRuntime);
    console.log(`most popular genre`, favoriteGenre);
  }

  // renderStatistics() {
  //   let ctx = document.querySelector(`.statistic__chart`);
  //   const genreList = [
  //     {
  //       label: `Sci-Fi`,
  //       value: 11,
  //     },
  //     {
  //       label: `Animation`,
  //       value: 8,
  //     },
  //     {
  //       label: `Fantasy`,
  //       value: 6,
  //     },
  //     {
  //       label: `Comedy`,
  //       value: 4,
  //     },
  //     {
  //       label: `TV Series`,
  //       value: 9,
  //     },
  //   ];

  //   let statistic__chart = new Chart(ctx, {
  //     type: `horizontalBar`,
  //     data: {
  //       // labels: [{'tr': 12}.value],
  //       datasets: [{
  //         data: [
  //           genreList[0].value,
  //           genreList[1].value,
  //           genreList[2].value,
  //           genreList[3].value,
  //           genreList[4].value],
  //         backgroundColor: `rgba(255, 206, 86, 1)`,
  //         barThickness: 20,
  //         maxBarThickness: 30,
  //         barPercentage: 0.5,
  //       }],
  //       labels: [`${genreList[0].label} ${genreList[0].value}`,
  //         `${genreList[1].label} ${genreList[1].value}`,
  //         `${genreList[2].label} ${genreList[2].value}`,
  //         `${genreList[3].label} ${genreList[3].value}`,
  //         `${genreList[4].label} ${genreList[4].value}`,
  //       ],
  //     },
  //     options: {
  //       legend: {
  //         display: false,
  //       },
  //       scales: {
  //         display: false,
  //         xAxes: [{
  //           gridLines: {
  //             display: false,
  //           },
  //           display: false,
  //           ticks: {
  //             display: false,
  //             beginAtZero: true,
  //           }
  //         }],
  //         yAxes: [{
  //           gridLines: {
  //             display: false,
  //           },
  //         }]
  //       }
  //     }
  //   });
  // }

  _getFavoriteGenre() {
    return this._getStatisticsData()[0].label;
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

  _getStatisticsData() {
    let moviesStatistics = [];
    GenreItems.map((genre) => {
      let count = this._getMoviesByGenre(genre).length;
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

  _getMoviesByGenre(genre) {
    const moviesByGenre = this._watchedMovies.filter((film) => film.genres.includes(genre));
    return moviesByGenre;
  }
}
