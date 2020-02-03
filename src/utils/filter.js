import {FilterType} from '../const.js';

const getAllMovies = (movies) => {
  const allMovies = movies.sort((a, b) => a.id - b.id);
  return allMovies;
};

const getInWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.watchlist);
};

const getNotInWatchlistMovies = (movies) => {
  return movies.filter((movie) => !movie.userDetails.watchlist);
};

const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched);
};

const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.favorite);
};

const getMoviesByFilter = (movies, filterType) => {
  let moviesByFilter = movies;
  switch (filterType) {
    case FilterType.ALL:
      moviesByFilter = getAllMovies(movies);
      break;
    case FilterType.WATCHLIST:
      moviesByFilter = getInWatchlistMovies(movies);
      break;
    case FilterType.HISTORY:
      moviesByFilter = getWatchedMovies(movies);
      break;
    case FilterType.FAVORITES:
      moviesByFilter = getFavoriteMovies(movies);
      break;
  }

  return moviesByFilter;
};

export {getAllMovies, getInWatchlistMovies, getNotInWatchlistMovies,
  getWatchedMovies, getFavoriteMovies, getMoviesByFilter};

