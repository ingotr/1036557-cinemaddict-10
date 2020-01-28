import moment from 'moment';
import {DescriptionItems, MonthNames} from '../const.js';

const MAX = {
  DESCRIPTION_LENGTH: 3,
  RATING: 9,
  RUNTIME: 299,
  COMMENTS_NUMBER: 9,
};

const HOUR_LENGTH = 60;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomElement = (arr) => {
  return arr[getRandomIntegerNumber(0, arr.length)];
};

const getRandomDescription = () => {
  const currentLength = getRandomIntegerNumber(1, MAX.DESCRIPTION_LENGTH);
  let description = [];
  for (let i = 0; i < currentLength; i++) {
    description[i] = DescriptionItems[i];
  }
  description = description.join(` `);
  return description;
};

const getRandomRating = () => {
  return Math.fround(Math.random() * MAX.RATING).toFixed(1);
};

const getRandomDate = () => {
  return new Date(new Date(2015, 1, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2015, 1, 1).getTime()));
};

const getRandomYear = () => {
  return moment(getRandomDate(new Date(2019, 6, 6), new Date())).format(`YYYY`);
};

const getTargetYear = (target) => {
  return moment(getRandomDate(new Date(target, 1, 1), new Date())).format(`YYYY`);
};

const getCommentDateFromNow = () => {
  return moment(getRandomYear(), `hh:mm:ss a`).fromNow();
};

const getReleaseDate = (year) => {
  const targetDate = getRandomDate(new Date(1900, 1, 1), new Date());
  const targetDay = targetDate.getDay();
  const targetMonth = MonthNames[targetDate.getMonth()];
  const targetYear = year;
  let releaseDate = `${targetDay} ${targetMonth} ${targetYear}`;

  return moment(releaseDate).format(`DD MMMM YYYY`);
};

const getTimeDuration = (startTime, durationLength, durationLengthUnit) => {
  return moment(startTime).subtract(durationLength, durationLengthUnit).format(`DD MMMM YYYY`);
};

const getRuntimeHours = (runtime) => {
  return Math.trunc(runtime / HOUR_LENGTH);
};

const getRuntimeMinutes = (runtime) => {
  return runtime % HOUR_LENGTH;
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
  return getRandomIntegerNumber(0, MAX.RUNTIME);
};

const getRandomCommentsNumber = () => {
  return getRandomIntegerNumber(0, MAX.COMMENTS_NUMBER);
};

const getYearFromIso = (isoDate) => {
  return moment(isoDate).format(`YYYY`);
};

const getDateFromIso = (isoDate) => {
  return moment(isoDate).format(`DD MMMM YYYY`);
};

const getCurrentDate = () => {
  return moment(new Date()).format(`DD MMMM YYYY`);
};

const getCurrentDateIsoFormat = () => {
  return new Date().toISOString();
};

const getRandomWatchedDate = () => {
  return moment(getRandomDate()).format(`DD MMMM YYYY`);
};

const debounce = (debounceInterval) => {
  let lastTimeout;
  window.debounce = {
    debounce(cb) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, debounceInterval);
    },
  };
};


export {getRandomIntegerNumber, getRandomElement, getRandomRating,
  getRandomYear, getCommentDateFromNow, getReleaseDate,
  getRandomDuration, getRandomDescription, getRandomCommentsNumber, getCurrentDate,
  getFormattedRuntime, getTimeDuration, getRandomWatchedDate, getTargetYear,
  getDateFromIso, getYearFromIso, getCurrentDateIsoFormat, debounce};
