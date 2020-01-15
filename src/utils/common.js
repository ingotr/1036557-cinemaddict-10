import moment from 'moment';
import {DescriptionItems, MonthNames} from '../const.js';

const MAX_DESCRIPTION_LENGTH = 3;
const MAX_RATING = 9;
const MAX_RUNTIME = 299;
const MAX_COMMENTS_NUMBER = 9;
const HOUR_LENGTH = 60;

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

const getRandomDate = () => {
  return new Date(new Date(2015, 1, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2015, 1, 1).getTime()));
};

const getRandomYear = () => {
  const targetYear = moment(getRandomDate(new Date(2019, 6, 6), new Date())).format(`YYYY`);

  return targetYear;
};

const getTargetYear = (target) => {
  const targetYear = moment(getRandomDate(new Date(target, 1, 1), new Date())).format(`YYYY`);

  return targetYear;
};

const getCommentDateFromNow = () => {
  const targetDate = moment(getRandomYear(), `hh:mm:ss a`).fromNow();

  return targetDate;
};

const getReleaseDate = (year) => {
  const targetDate = getRandomDate(new Date(1900, 1, 1), new Date());
  const targetDay = targetDate.getDay();
  const targetMonth = MonthNames[targetDate.getMonth()];
  const targetYear = year;
  let releaseDate = `${targetDay} ${targetMonth} ${targetYear}`;
  releaseDate = moment(releaseDate).format(`DD MMMM YYYY`);

  return releaseDate;
};

const getTimeDuration = (startTime, durationLength, durationLengthUnit) => {
  let timeDuration = moment(startTime).subtract(durationLength, durationLengthUnit).format(`DD MMMM YYYY`);

  return timeDuration;
};

const getRuntimeHours = (runtime) => {
  const hours = Math.trunc(runtime / HOUR_LENGTH);
  return hours;
};

const getRuntimeMinutes = (runtime) => {
  const minutes = runtime % HOUR_LENGTH;
  return minutes;
};

const getFormattedRuntime = (runtime) => {
  return {
    digits: {
      hours: getRuntimeHours(runtime),
      minutes: getRuntimeMinutes(runtime),
    },
    labels: {
      HOURS: `h`,
      MINUTES: `m`,
    },
  };
};

const getRandomDuration = () => {
  const runtime = getRandomIntegerNumber(0, MAX_RUNTIME);

  return runtime;
};

const getRandomCommentsNumber = () => {
  const commentsNumber = getRandomIntegerNumber(0, MAX_COMMENTS_NUMBER);
  return commentsNumber;
};

const getCurrentDate = () => {
  let currentDate = new Date();
  currentDate = moment(currentDate).format(`DD MMMM YYYY`);
  return currentDate;
};

const getRandomWatchedDate = () => {
  const watchedDate = moment(getRandomDate()).format(`DD MMMM YYYY`);
  return watchedDate;
};

export {getRandomIntegerNumber, getRandomElement, getRandomRating,
  getRandomYear, getCommentDateFromNow, getReleaseDate,
  getRandomDuration, getRandomDescription, getRandomCommentsNumber, getCurrentDate,
  getFormattedRuntime, getTimeDuration, getRandomWatchedDate, getTargetYear};
