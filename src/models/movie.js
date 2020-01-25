/* eslint-disable camelcase */
import {getYearFromIso} from '../utils/common.js';
export default class Movie {
  constructor(data) {
    this.id = data[`id`];

    this.comments = data[`comments`] || [];

    this.filmInfo = data[`film_info`];
    this.filmInfo.title = this.filmInfo[`title`];
    this.filmInfo.alternative_title = this.filmInfo[`alternative_title`];
    this.filmInfo.total_rating = this.filmInfo[`total_rating`];
    this.filmInfo.poster = this.filmInfo[`poster`];
    this.filmInfo.age_rating = this.filmInfo[`age_rating`];
    this.filmInfo.director = this.filmInfo[`director`];
    this.filmInfo.actors = this.filmInfo[`actors`];
    this.filmInfo.writers = this.filmInfo[`writers`];

    this.filmInfo.release = this.filmInfo[`release`];
    this.filmInfo.release.year = getYearFromIso(this.filmInfo.release[`date`]);
    this.filmInfo.release.date = this.filmInfo.release[`date`];
    this.filmInfo.release.release_country = this.filmInfo.release[`release_country`];
    this.filmInfo.runtime = this.filmInfo[`runtime`];
    this.filmInfo.genre = this.filmInfo[`genre`];
    this.filmInfo.description = this.filmInfo[`description`];

    this.userDetails = data[`user_details`];
    this.userDetails.personal_rating = this.userDetails[`personal_rating`];
    this.userDetails.watchlist = Boolean(this.userDetails[`watchlist`]);
    this.userDetails.already_watched = Boolean(this.userDetails[`already_watched`]);
    this.userDetails.watching_date = this.userDetails[`watching_date`] ? new Date(this.userDetails[`watching_date`]) : null;
    this.userDetails.favorite = Boolean(this.userDetails[`favorite`]);

  }

  toRaw() {
    return {
      'id': this.id,

      'comments': [],

      'film_info': {
        'title': this.filmInfo.title,
        'alternative_title': this.filmInfo.alternative_title,
        'total_rating': this.filmInfo.total_rating,
        'poster': this.filmInfo.poster,
        'age_rating': this.filmInfo.age_rating,
        'director': this.filmInfo.director,
        'actors': Array.from(this.filmInfo.actors),
        'writers': Array.from(this.filmInfo.writers),
        'release': {
          'date': this.filmInfo.release.date,
          'release_country': this.filmInfo.release.release_country,
        },
        'runtime': this.filmInfo.runtime,
        'genre': Array.from(this.filmInfo.genre),
        'description': this.filmInfo.description,
      },
      'user_details': {
        'personal_rating': this.userDetails.personal_rating,
        'watchlist': this.userDetails.watchlist,
        'already_watched': this.userDetails.already_watched,
        'watching_date': this.userDetails.watching_date ? this.userDetails.watching_date : null,
        'favorite': this.userDetails.favorite,
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRaw());
  }
}
