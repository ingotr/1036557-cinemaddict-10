import {FilterType} from '../const.js';

export const getAllMovies = (movies) => {
  return movies;
};

export const getInWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.isOnWatchList);
};

export const getNotInWatchlistMovies = (movies) => {
  return movies.filter((movie) => !movie.isOnWatchList);
};

export const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.isWatched);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.isFavorite);
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

