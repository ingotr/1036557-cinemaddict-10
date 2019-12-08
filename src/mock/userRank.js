import {getRandomIntegerNumber} from '../components/utils/common.js';

const MAX_USER_RANK = 100;

export const getRandomUserRank = () => {
  return getRandomIntegerNumber(0, MAX_USER_RANK);
};
