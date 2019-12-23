import {getRandomElement, getCommentDateFromNow} from '../utils/common.js';


const TextBlocks = [
  `Boring...Sleep`,
  `Want to see anotrher time`,
  `Would recommend to my friends!`,
  `Meeh...`,
  `Not for me`,
  `Too long to see after work`,
];

const Emojis = [
  `sleeping`,
  `smile`,
  `angry`,
];

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
    date: getCommentDateFromNow(),
    deleteBtn: ``,
  };
};

const generateComments = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateComment);
};

export {generateComment, generateComments};


