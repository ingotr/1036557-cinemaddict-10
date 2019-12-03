import {getRandomUserRank} from '../mock/userRank.js';

const getUserRank = () => {
  const count = getRandomUserRank();
  let rank = ``;

  if ((count >= 1) && (count <= 10)) {
    rank = `novice`;
  }
  if ((count >= 11) && (count <= 20)) {
    rank = `fan`;
  }
  if (count >= 21) {
    rank = `movie buff`;
  }

  return rank;
};

export const createUserRankTemplate = () => {
  const rank = getUserRank();

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
