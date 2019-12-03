const MAX_FILM_NUMBER = 20;

const filterNames = [
  `Watchlist`, `History`, `Favorites`,
];

const generateFilters = () => {
  return filterNames.map((it) => ({
    name: it,
    count: Math.floor(Math.random() * MAX_FILM_NUMBER),
  }));
};

export {generateFilters};
