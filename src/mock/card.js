import {NameItems, PosterItems, GenreItems} from '../const.js';
import {getRandomElement, getRandomRating, getRandomYear, getRandomDuration, getRandomDescription, getRandomCommentsNumber} from '../utils.js';

const generateCard = () => {
  return {
    title: getRandomElement(NameItems),
    rating: getRandomRating(),
    year: getRandomYear(),
    duration: getRandomDuration(),
    genre: getRandomElement(GenreItems),
    poster: getRandomElement(PosterItems),
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

