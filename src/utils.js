import {DescriptionItems, MonthNames} from './const.js';

const MAX_DESCRIPTION_LENGTH = 3;
const MAX_RATING = 9;
const MAX_HOURS_RUNTIME = 4;
const MAX_MINUTES_RUNTIME = 59;
const MAX_COMMENTS_NUMBER = 9;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomElement = (arr) => {
  return arr[getRandomIntegerNumber(0, arr.length)];
};

const getRandomDescription = () => {
  const currentLength = getRandomIntegerNumber(1, MAX_DESCRIPTION_LENGTH);
  let description = [];
  for (let i = 0; i < currentLength; i++) {
    description[i] = DescriptionItems[i];
  }
  description = description.join(` `);
  return description;
};

const getRandomRating = () => {
  return Math.fround(Math.random() * MAX_RATING).toFixed(1);
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomYear = () => {
  const targetDate = getRandomDate(new Date(1900, 1, 1), new Date());
  const targetYear = targetDate.getFullYear();

  return targetYear;
};

const getReleaseDate = () => {
  const targetDate = getRandomDate(new Date(1900, 1, 1), new Date());
  const targetDay = targetDate.getDay();
  const targetMonth = MonthNames[targetDate.getMonth()];
  const targetYear = targetDate.getFullYear();
  const releaseDate = `${targetDay} ${targetMonth} ${targetYear}`;

  return releaseDate;
};

const getRandomDuration = () => {
  const hours = getRandomIntegerNumber(0, MAX_HOURS_RUNTIME);
  const minutes = getRandomIntegerNumber(0, MAX_MINUTES_RUNTIME);
  const duration = `${hours}h ${minutes}m`;

  return duration;
};

const getRandomCommentsNumber = () => {
  const commentsNumber = getRandomIntegerNumber(0, MAX_COMMENTS_NUMBER);
  return commentsNumber;
};

export {getRandomIntegerNumber, getRandomElement, getRandomRating, getRandomYear, getReleaseDate, getRandomDuration, getRandomDescription, getRandomCommentsNumber};
