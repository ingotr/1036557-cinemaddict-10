const filterNames = [
  `Watchlist`, `History`, `Favorites`,
];

const generateFilters = () => {
  const MAX_FILM_NUMBER = 20;
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * MAX_FILM_NUMBER),
    };
  });
};

export {generateFilters};
