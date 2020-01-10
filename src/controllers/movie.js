import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import he from 'he';
import {render, replace, RenderPosition} from '../utils/render.js';
import {EMOJI_ID} from '../const.js';
import {getCurrentDate} from '../utils/common.js';

const Mode = {
  // ADDING: `adding`,
  DEFAULT: `default`,
  POPUP: `popup`,
};

let emptyComment = {
  text: ``,
  author: ``,
  emoji: ``,
  date: ``,
  deleteBtn: ``,
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onFiltersChange, onUserRatingChange,
      onViewChange, onCommentsCountChange, onEmojiChange) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._mode = Mode.DEFAULT;

    this._cardComponent = null;
    this._popupComponent = null;

    this._onDataChange = onDataChange;
    this._onFiltersChange = onFiltersChange;
    this._onUserRatingChange = onUserRatingChange;
    this._onViewChange = onViewChange;
    this._onCommentsCountChange = onCommentsCountChange;
    this._onEmojiChange = onEmojiChange;

    this._emptyComment = emptyComment;

    this._setDefaultView = this._setDefaultView;
  }

  _watchListButtonClickHandler(data) {
    this._onFiltersChange(`watchlist`, !data.isOnWatchList);
    data.isOnWatchList = !data.isOnWatchList;
  }

  _markWatchedButtonClickHandler(data) {
    this._onFiltersChange(`history`, !data.isWatched);
    data.isWatched = !data.isWatched;
  }

  _setFavoriteButtonClickHandler(data) {
    this._onFiltersChange(`favorites`, !data.isFavorite);
    data.isFavorite = !data.isFavorite;
  }

  render(data, container = this._container) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._data = data;
    this._cardComponent = new CardComponent(data);
    this._popupComponent = new PopupComponent(data);

    const popupMiddleContainer = this._popupComponent.getElement().querySelector(`.form-details__middle-container`);

    const popupUserRating = this._popupComponent.getElement().querySelector(`.film-details__user-rating`);

    const addEventListenerToComponent = (popContainer, card, popup) => {
      const onEscKeyPress = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

        if (isEscKey) {
          this._replacePopupToCard();

          popup.getElement().remove();
          popup.removeElement();

          document.removeEventListener(`keydown`, onEscKeyPress);
        }
      };

      let keysPressed = {};

      const onCtrlEnterPress = (event) => {
        keysPressed[event.key] = true;

        let isEmojiExistInList = Object.values(EMOJI_ID).includes(this._emptyComment.emoji);

        const commentArea = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
        const commentAreaText = commentArea.value;

        this._emptyComment.text = he.encode(commentAreaText);

        if (keysPressed[`Control`] && event.key === `Enter`
        && this._emptyComment.text.length > 0 && isEmojiExistInList) {
          this._emptyComment.date = getCurrentDate();
          const newComment = new CommentComponent(this._emptyComment);
          console.table(`this is newComment `, newComment);

          const popupElement = this._popupContainer.getElement().querySelector(`.film-details`);
          const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);

          console.log(`this card component `, this._cardComponent);
          this._onCommentsCountChange(this, null, this._cardComponent, 0, commentsListElement, newComment);
          this._cleanBufferComment();
        }
      };

      card.setCardElementsClickHandler(() => {
        this._replaceCardToPopup();

        this.renderPopup();

        document.addEventListener(`keydown`, onEscKeyPress);

        document.addEventListener(`keydown`, onCtrlEnterPress);

        document.addEventListener(`keyup`, (event) => {
          delete keysPressed[event.key];
        });
      });

      popup.setCloseButtonClickHandler(() => {
        this._replacePopupToCard();

        popup.getElement().remove();
        popup.removeElement();
      });
    };

    this._cardComponent.setAddToWatchlistButtonCLickHandler(() => {
      event.preventDefault();
      this._watchListButtonClickHandler(data);
      this._onDataChange();
    });

    this._cardComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      this._markWatchedButtonClickHandler(data);
      this._onDataChange();
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      event.preventDefault();
      this._setFavoriteButtonClickHandler(data);
      this._onDataChange();
    });

    this._popupComponent.setAddToWatchlistButtonCLickHandler(() => {
      data.isOnWatchList = !data.isOnWatchList;
      this._onDataChange();
    });

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
      data.isOnWatchList = !data.isOnWatchList;

      popupUserRating.classList.add(`visually-hidden`);
      if (data.userRating !== null) {
        data.userRating = null;
        this._onUserRatingChange(popupUserRating, data.userRating);
      } else {
        popupUserRating.classList.add(`visually-hidden`);
      }

      popupMiddleContainer.classList.toggle(`visually-hidden`);

      this._onDataChange();
    });

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      data.isFavorite = !data.isFavorite;
      this._onDataChange();
    });

    this._popupComponent.setUserRatingChangeHandler((evt) => {
      data.userRating = evt.target.value;
      this._onUserRatingChange(popupUserRating, data.userRating);
      popupUserRating.classList.remove(`visually-hidden`);
    });

    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(container, this._cardComponent.getElement(), RenderPosition.AFTERBEGIN);
    }

    addEventListenerToComponent(this._popupContainer, this._cardComponent, this._popupComponent);
  }

  _removeComments(list) {
    const commentsList = list;
    commentsList.innerHTML = ``;
  }

  renderComments(popupCommentsList, commentsListElement) {
    const popupComponent = this._popupComponent;

    popupCommentsList.slice(0, popupCommentsList.length)
    .forEach((comment, index) => {
      const currentComment = new CommentComponent(comment);
      render(commentsListElement, currentComment.getElement(), RenderPosition.BEFOREEND);

      this._addCommentsHandlers(currentComment, index, commentsListElement);
    });

    popupComponent.setEmojiItemClickHandlers(() => {
      const bigEmojiContainer = popupComponent.getElement().querySelector(`.big-emoji`);
      this._emptyComment.emoji = this._onEmojiChange(event.target.id, bigEmojiContainer);
    });
  }

  renderPopup() {
    const popupData = this._data;
    console.log(popupData);
    render(this._popupContainer.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);
    const popupElement = this._popupContainer.getElement().querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = popupData.comments;
    console.log(popupCommentsList);

    this.renderComments(popupCommentsList, commentsListElement);
  }

  _addCommentsHandlers(currentComment, commentIndex, commentContainer) {
    currentComment.setCommentsDeleteButtonClickHandler(() => {
      event.preventDefault();
      this._onCommentsCountChange(this, this._cardComponent, null, commentIndex, commentContainer, null);
    });
  }

  _replaceCardToPopup() {
    this._onViewChange();
    this._mode = Mode.POPUP;
  }

  _replacePopupToCard() {
    this._mode = Mode.DEFAULT;
  }

  _setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupComponent.getElement().remove();
      this._popupComponent.removeElement();

      this._replacePopupToCard();
    }
  }

  _cleanBufferComment() {
    Object.keys(emptyComment).map((key) => {
      emptyComment[key] = ``;
    });
    this._emptyComment = emptyComment;
    console.log(`just clean up the buffer container`, emptyComment);
  }
}
