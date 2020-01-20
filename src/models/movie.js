export default class Movie {
  constructor(data) {
    this.id = data[`id`];

    this.comments = new Set(data[`comments`] || []);

    this.filmInfo.title = data[`title`];
    this.filmInfo.alternativeTitle = data[`alternative_title`];
    this.filmInfo.totalRating = data[`total_rating`];
    this.filmInfo.poster = data[`poster`];
    this.filmInfo.ageRating = data[`age_rating`];
    this.filmInfo.director = data[`director`];
    this.filmInfo.writers = new Set(data[`writers`] || []);
    this.filmInfo.actors = new Set(data[`actors`] || []);
    this.filmInfo.release.date = data[`date`];
    this.filmInfo.release.releaseCountry = data[`release_country`];
    this.filmInfo.runtime = data[`runtime`];
    this.filmInfo.genre = new Set(data[`genre`] || []);
    this.filmInfo.description = data[`description`];

    this.userDetails.personalRating = data[`personal_rating`];
    this.userDetails.watchlist = Boolean(data[`watchlist`]);
    this.userDetails.alreadyWatched = Boolean(data[`already_watched`]);
    this.userDetails.watchingDate = data[`watching_date`] ? new Date(data[`watching_date`]) : null;
    this.userDetails.favorite = Boolean(data[`favorite`]);
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
