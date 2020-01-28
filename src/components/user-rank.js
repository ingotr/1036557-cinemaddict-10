import AbstractComponent from './abstract-component.js';

const UserRanks = {
  NONE: {
    count: 0,
    title: ``,
  },
  NOVICE: {
    countMin: 1,
    countMax: 11,
    title: `novice`,
  },
  FAN: {
    countMin: 11,
    countMax: 20,
    title: `fan`,
  },
  BUFF: {
    countMin: 21,
    title: `movie buff`,
  },
};

const getUserRank = (watchedMovies) => {
  const rank = ``;

  if ((watchedMovies >= UserRanks.NOVICE.countMin) && (watchedMovies <= UserRanks.NOVICE.countMax)) {
    return UserRanks.NOVICE;
  }
  if ((watchedMovies >= UserRanks.FAN.countMin) && (watchedMovies <= UserRanks.FAN.countMax)) {
    return UserRanks.FAN;
  }
  if (watchedMovies >= UserRanks.BUFF.countMin) {
    return UserRanks.BUFF;
  }

  return rank;
};

const createUserRankTemplate = () => {
  const rank = getUserRank();

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank extends AbstractComponent {
  getTemplate() {
    return createUserRankTemplate();
  }
}
