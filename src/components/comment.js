import AbstractSmartComponent from './abstract-smart-component.js';
import he from 'he';
import {getDateFromIso} from '../utils/common.js';

const DefaultData = {
  deleteButtonText: `Delete`,
};

const createCommentMarkup = (commentary, externalData) => {
  const {author, comment, date, emotion} = commentary;

  const encodedText = he.encode(comment);

  const formattedDate = getDateFromIso(date);

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
          <span class="film-details__comment-day">${formattedDate}</span>
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

  setCommentsDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}
