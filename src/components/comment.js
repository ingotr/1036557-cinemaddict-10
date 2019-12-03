import {createElement} from '../utils.js';

const createCommentMarkup = (comment) => {
  const {text, emoji, autor, date} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${autor}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment {
  constructor(comment) {
    this._comment = comment;

    this._element = null;
  }

  getTemplate() {
    return createCommentMarkup(this._comment);
  }

  getElement() {
    if (!this._elment) {
      this._element = createElement(this.geteTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
