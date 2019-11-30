import {NameItems, PosterItems, DescriptionItems} from './const.js';

const MAX_RATING = 9;

const GenreItems = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Biography`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Family`,
  `Fantasy`,
  `Film-noir`,
  `History`,
  `Horror`,
  `Music`,
  `Mystery`,
  `Romance`,
  `Sci-Fi`,
  `Sport`,
  `Thriller`,
  `War`,
  `Western`,
];

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomName = () => {
  return NameItems[getRandomIntegerNumber(0, NameItems.length)];
};

const getRandomPoster = () => {
  return PosterItems[getRandomIntegerNumber(0, PosterItems.length)];
};

const getRandomDescription = () => {
  const MAX_DESCRIPTION_LENGTH = 3;

  const currentLength = getRandomIntegerNumber(1, MAX_DESCRIPTION_LENGTH);
  const description = ``;
  for (let i = 0; i < currentLength; i++) {
    description += DescriptionItems[i];
  }
  return description;
};

const getRandomRating = () => {
  return Math.fround(Math.random() * MAX_RATING).toFixed(1);
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const getRandomDuration = () => {
  const MAX_HOURS_RUNTIME = 4;
  const MAX_MINUTES_RUNTIME = 59;

  const hours = getRandomIntegerNumber(0, MAX_HOURS_RUNTIME);
  const minutes = getRandomIntegerNumber(0, MAX_MINUTES_RUNTIME);
  const duration = `${hours}h ${minutes}m`;

  return duration;
};

const getRandomGenre = () => {
  return getRandomIntegerNumber(0, GenreItems.length);
};

const getRandomCommentsNumber = () => {
  const MAX_COMMENTS_NUMBER = 999;
  const commentsNumber = getRandomIntegerNumber(0, MAX_COMMENTS_NUMBER);
  return commentsNumber;
};

const generateCard = () => {
  return {
    name: getRandomName(),
    rating: getRandomRating(),
    year: getRandomDate(),
    duration: getRandomDuration(),
    genre: getRandomGenre(),
    poster: getRandomPoster(),
    description: getRandomDescription(),
    commentsNumber: getRandomCommentsNumber(),
  };
};

const generateCards = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateCard);
};

export {generateCard, generateCards};

