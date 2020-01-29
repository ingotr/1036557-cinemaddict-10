import AbstractSmartComponent from './abstract-smart-component';

const UserRanks = {
  NONE: {
    count: 0,
    title: ``,
  },
  NOVICE: {
    countMin: 1,
    countMax: 10,
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

const createUserRankTemplate = (rank) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank extends AbstractSmartComponent {
  constructor() {
    super();

    this._rank = null;
  }

  getRank() {
    return this._rank;
  }

  getTemplate() {
    return createUserRankTemplate(this._rank);
  }

  setUserRank(watchedMovies) {
    if ((watchedMovies >= UserRanks.NOVICE.countMin) && (watchedMovies <= UserRanks.NOVICE.countMax)) {
      this._rank = UserRanks.NOVICE.title;
    } else {
      if ((watchedMovies >= UserRanks.FAN.countMin) && (watchedMovies <= UserRanks.FAN.countMax)) {
        this._rank = UserRanks.FAN.title;
      } else {
        if (watchedMovies >= UserRanks.BUFF.countMin) {
          this._rank = UserRanks.BUFF.title;
        }
      }
    }
  }
}
