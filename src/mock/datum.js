import {getRandomIntegerNumber, getRandomElement, getRandomRating, getReleaseDate, getRandomDuration, getRandomDescription, getRandomCommentsNumber} from '../utils.js';
import {NameItems, PosterItems, GenreItems} from '../const.js';
import {generateComments} from './comment.js';

const MAX_GENRES_NUMBER = 3;
const NameOfDirectors = [
  `Frank Darabont`,
  `Francis Ford Coppola`,
  `Christopher Nolan`,
  `Sidney Lumet`,
  `Steven Spielberg`,
  `Peter Jackson`,
  `Quentin Tarantino`,
];

const NameOfWriters = [
  `Stephen King`,
  `Mario Puzo`,
  `Jonathan Nolan`,
  `Reginald Rose`,
  `Thomas Keneally`,
  `Fran Walsh`,
  `Roger Avary`,
];

const NameOfActors = [
  `Tim Robbins`,
  `Morgan Freeman`,
  `Marlon Brando`,
  `Al Pacino`,
  `Christian Bale`,
  `Liam Neeson`,
  `John Travolta`,
];

const Country = [
  `USA`,
  `France`,
  `Italy`,
  `Russia`,
  `Spain`,
  `Germany`,
];

const AgeCertificats = [
  `12+`,
  `14+`,
  `16+`,
  `18+`,
];

const getRandomGenres = () => {
  const maxNumberOfGenres = getRandomIntegerNumber(1, MAX_GENRES_NUMBER);
  const genres = new Array(maxNumberOfGenres).fill(``);

  for (let i = 0; i < maxNumberOfGenres; i++) {
    genres[i] += getRandomElement(GenreItems);
  }

  return genres;
};

const generateData = () => {
  const commCount = getRandomCommentsNumber();
  return {
    title: getRandomElement(NameItems),
    rating: getRandomRating(),
    year: getReleaseDate(),
    duration: getRandomDuration(),
    poster: getRandomElement(PosterItems),
    description: getRandomDescription(),
    commentsNumber: commCount,
    director: getRandomElement(NameOfDirectors),
    writers: getRandomElement(NameOfWriters),
    actors: getRandomElement(NameOfActors),
    country: getRandomElement(Country),
    genres: getRandomGenres(),
    age: getRandomElement(AgeCertificats),
    comments: generateComments(commCount),
  };
};

const generateDatum = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateData);
};

export {generateDatum};