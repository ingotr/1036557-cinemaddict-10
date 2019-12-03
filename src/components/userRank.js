import {getRandomUserRank} from '../mock/userRank.js';
import {createElement} from '../utils.js';

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

const createUserRankTemplate = () => {
  const rank = getUserRank();

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
