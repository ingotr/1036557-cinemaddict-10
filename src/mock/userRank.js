const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const getRandomUserRank = () => {
  return getRandomIntegerNumber(0, 100);
};
