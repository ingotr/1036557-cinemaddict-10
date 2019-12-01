import {getRandomElement, getReleaseDate} from '../utils.js';


const TextBlocks = [
  `Boring...Sleep`,
  `Want to see anotrher time`,
  `Would recommend to my friends!`,
  `Meeh...`,
  `Not for me`,
  `Too long to see after work`,
];

const Emojis = new Map([
  [`sleeping`, `sleeping`],
  [`neutral-face`, `smile`],
  [`grinning`, `smile`],
]);

const Autors = [
  `Frank`,
  `Steven`,
  `Sidney`,
  `Roger`,
  `John`,
];

const generateComment = () => {
  return {
    text: getRandomElement(TextBlocks),
    emoji: getRandomElement(Emojis),
    autor: getRandomElement(Autors),
    date: getReleaseDate(),
    deleteBtn: ``,
  };
};

const generateComments = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateComment);
};

export {generateComment, generateComments};


