import {FilterType} from '../const.js';

const getAllMovies = (movies) => {
  return movies;
};

const getInWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.watchlist);
};

const getNotInWatchlistMovies = (movies) => {
  return movies.filter((movie) => !movie.userDetails.watchlist);
};

const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.already_watched);
};

const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.favorite);
};

const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getAllMovies(movies);
    case FilterType.WATCHLIST:
      return getInWatchlistMovies(movies);
    case FilterType.HISTORY:
      return getWatchedMovies(movies);
    case FilterType.FAVORITES:
      return getFavoriteMovies(getNotInWatchlistMovies(movies));
  }

  return movies;
};

export {getAllMovies, getInWatchlistMovies, getNotInWatchlistMovies,
  getWatchedMovies, getFavoriteMovies, getMoviesByFilter};

