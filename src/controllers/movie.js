/* eslint-disable camelcase */
import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import MovieModel from '../models/movie.js';
import he from 'he';
import {render, replace, RenderPosition} from '../utils/render.js';
import {EMOJI_IDS} from '../const.js';
import {getCurrentDate, getCurrentDateIsoFormat} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
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

    this._emptyCommentEmoji = ``;

    this._setDefaultView = this._setDefaultView;

    this._currentDelectingComment = null;
    this._createNewCommentForm = null;
  }

  _watchListButtonClickHandler(data) {
    const newMovie = MovieModel.clone(data);
    newMovie.userDetails.watchlist = !newMovie.userDetails.watchlist;

    this._onDataChange(this, data, newMovie);
  }

  _markWatchedButtonClickHandler(data) {
    const newMovie = MovieModel.clone(data);
    newMovie.userDetails.already_watched = !newMovie.userDetails.already_watched;

    if (newMovie.userDetails.alreadyWatched) {
      newMovie.userDetails.watchingDate = getCurrentDate();
    }

    this._onDataChange(this, data, newMovie);
  }

  _setFavoriteButtonClickHandler(data) {
    const newMovie = MovieModel.clone(data);
    newMovie.userDetails.favorite = !newMovie.userDetails.favorite;

    this._onDataChange(this, data, newMovie);
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

        let isEmojiExistInList = Object.values(EMOJI_IDS).includes(this._emptyCommentEmoji);

        const commentArea = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
        commentArea.removeAttribute(`disabled`);
        commentArea.style = `border: 0px solid red`;

        const commentAreaText = commentArea.value;

        const newCommentText = he.encode(commentAreaText);
        const newCommentEmoji = this._emptyCommentEmoji;


        if (keysPressed[`Control`] && event.key === `Enter`
        && newCommentText.length > 0 && isEmojiExistInList) {

          this._createNewCommentForm = commentArea;
          commentArea.setAttribute(`disabled`, `true`);

          const emptyComment = {
            "comment": newCommentText,
            "date": getCurrentDateIsoFormat(),
            "emotion": newCommentEmoji,
          };

          const popupElement = this._popupContainer.getElement().querySelector(`.film-details`);
          const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);

          this._onCommentsCountChange(this, null, this._cardComponent, 0, commentsListElement, emptyComment);
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
      this._onFiltersChange();
    });

    this._cardComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      this._markWatchedButtonClickHandler(data);
      this._onFiltersChange();
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      event.preventDefault();
      this._setFavoriteButtonClickHandler(data);
      this._onFiltersChange();
    });

    this._popupComponent.setAddToWatchlistButtonCLickHandler(() => {
      const newMovie = MovieModel.clone(data);
      newMovie.userDetails.watchlist = !newMovie.userDetails.watchlist;

      this._onDataChange(this, data, newMovie);
      this._onFiltersChange();
    });

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
      const newMovie = MovieModel.clone(data);
      newMovie.userDetails.already_watched = !newMovie.userDetails.already_watched;

      if (newMovie.userDetails.already_watched) {
        newMovie.userDetails.watching_date = getCurrentDate();
      }

      popupUserRating.classList.add(`visually-hidden`);
      if (newMovie.userDetails.user_rating !== null) {
        newMovie.userDetails.user_rating = null;
        this._onUserRatingChange(popupUserRating, newMovie.userDetails.user_rating);
      } else {
        popupUserRating.classList.add(`visually-hidden`);
      }

      popupMiddleContainer.classList.toggle(`visually-hidden`);
      this._onDataChange(this, data, newMovie);
      this._onFiltersChange();
    });

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      const newMovie = MovieModel.clone(data);
      newMovie.userDetails.favorite = !newMovie.userDetails.favorite;

      this._onDataChange(this, data, newMovie);
      this._onFiltersChange();
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
    .forEach((comment) => {
      const currentComment = new CommentComponent(comment);

      render(commentsListElement, currentComment.getElement(), RenderPosition.BEFOREEND);

      this._addCommentsHandlers(currentComment, comment.id, commentsListElement);
    });

    popupComponent.setEmojiItemClickHandlers(() => {
      const bigEmojiContainer = popupComponent.getElement().querySelector(`.big-emoji`);
      this._emptyCommentEmoji = this._onEmojiChange(event.target.id, bigEmojiContainer);
    });
  }

  renderPopup() {
    const popupData = this._data;
    render(this._popupContainer.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);
    const popupElement = this._popupContainer.getElement().querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = popupData.comments;

    this.renderComments(popupCommentsList, commentsListElement);
  }

  getCurrentDeletingComment() {
    return this._currentDelectingComment;
  }

  getCreatingNewCommentForm() {
    return this._createNewCommentForm;
  }

  _addCommentsHandlers(currentComment, commentIndex, commentContainer) {
    this._currentDelectingComment = currentComment;
    currentComment.setCommentsDeleteButtonClickHandler(() => {
      event.preventDefault();
      currentComment.setData({
        deleteButtonText: `Deleting...`,
      });
      currentComment.setDeleteButtonLocked();

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

  newCommentDeliveryError(target) {
    target.style = `border: 1px solid red`;
  }

  shake(target) {
    this._popupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._popupComponent.getElement().style.animation = ``;

      target.setData({
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
