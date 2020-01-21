import {FilterType} from '../const.js';

export const getAllMovies = (movies) => {
  return movies;
};

export const getInWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.watchlist);
};

export const getNotInWatchlistMovies = (movies) => {
  return movies.filter((movie) => !movie.userDetails.watchlist);
};

export const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.already_watched);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.favorite);
};

export const getMoviesByFilter = (movies, filterType) => {
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

