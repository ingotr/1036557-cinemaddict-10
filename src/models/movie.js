import {getYearFromIso} from '../utils/common.js';
export default class Movie {
  constructor(data) {
    this.id = data[`id`];

    this.comments = data[`comments`] || [];

    this.filmInfo = data[`film_info`];
    this.filmInfo.title = this.filmInfo[`title`];
    this.filmInfo.alternativeTitle = this.filmInfo[`alternative_title`];
    this.filmInfo.totalRating = this.filmInfo[`total_rating`];
    this.filmInfo.poster = this.filmInfo[`poster`];
    this.filmInfo.ageRating = this.filmInfo[`age_rating`];
    this.filmInfo.director = this.filmInfo[`director`];
    this.filmInfo.actors = this.filmInfo[`actors`];
    this.filmInfo.writers = this.filmInfo[`writers`];

    this.filmInfo.release = this.filmInfo[`release`];
    this.filmInfo.release.year = getYearFromIso(this.filmInfo.release[`date`]);
    this.filmInfo.release.date = this.filmInfo.release[`date`];
    this.filmInfo.release.releaseCountry = this.filmInfo.release[`release_country`];
    this.filmInfo.runtime = this.filmInfo[`runtime`];
    this.filmInfo.genre = this.filmInfo[`genre`];
    this.filmInfo.description = this.filmInfo[`description`];

    this.userDetails = data[`user_details`];
    this.userDetails.personalRating = this.userDetails[`personal_rating`];
    this.userDetails.watchlist = Boolean(this.userDetails[`watchlist`]);
    this.userDetails.alreadyWatched = Boolean(this.userDetails[`already_watched`]);
    this.userDetails.watchingDate = this.userDetails[`watching_date`] ? new Date(this.userDetails[`watching_date`]) : null;
    this.userDetails.favorite = Boolean(this.userDetails[`favorite`]);

    this.setComments = this.setComments.bind(this);
  }

  toRaw() {
    return {
      'id': this.id,

      'comments': Array.from(this.comments),

      'personal_rating': this.userDetails.personalRating,
      'watchlist': this.userDetails.watchlist,
      'already_watched': this.userDetails.alreadyWatched,
      'watching_date': this.userDetails.watchingDate ? this.userDetails.watchingDate.toISOString() : null,
      'favorite': this.userDetails.favorite,
    };
  }

  setComments(data) {
    this.comments = data;
    return this.comments;
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
