import AbstractSmartComponent from './abstract-smart-component.js';
import he from 'he';
import moment from 'moment';

const DefaultData = {
  deleteButtonText: `Delete`,
};

const createCommentMarkup = (commentary, externalData) => {
  const {author, comment, date, emotion} = commentary;

  const encodedText = he.encode(comment);

  const commentDateFromNow = moment(date).fromNow();

  const deleteButtonText = externalData.deleteButtonText;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${encodedText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDateFromNow}</span>
          <button class="film-details__comment-delete">${deleteButtonText}</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();

    this._comment = comment;
    this._externalData = DefaultData;
  }

  setData(data) {
    this._externalData = Object.assign({}, data);
    this.rerender();
  }

  getTemplate() {
    return createCommentMarkup(this._comment, this._externalData);
  }

  getCommentData() {
    return this._comment;
  }

  setDeleteButtonUnlocked() {
    const buttonElement = this.getElement().querySelector(`.film-details__comment-delete`);
    buttonElement.removeAttribute(`disabled`);
  }

  setDeleteButtonLocked() {
    const buttonElement = this.getElement().querySelector(`.film-details__comment-delete`);
    buttonElement.setAttribute(`disabled`, `true`);
  }

  setCommentsDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}
