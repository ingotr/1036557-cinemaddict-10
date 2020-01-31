import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import MovieModel from '../models/movie.js';
import he from 'he';
import {render, replace, RenderPosition} from '../utils/render.js';
import {EmojiIds, RADIX_DECIMAL} from '../const.js';
import {getCurrentDateIsoFormat, debounce} from '../utils/common.js';

const DEBOUNCE_TIMEOUT = 1000;
const SHAKE_ANIMATION_TIMEOUT = 600;
const RATING_ZERO = 0;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const Keycodes = {
  ENTER: 13,
  CTRL: 17,
  ESCAPE: 27,
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
    this._emptyEmojiContainer = ``;

    this._setDefaultView = this._setDefaultView;

    this._currentDelectingComment = null;
    this._createNewCommentForm = null;
    this._ratingChangeButton = null;
    this._commentArea = null;
  }

  getPopup() {
    return this._popupComponent;
  }

  getCurrentDeletingComment() {
    return this._currentDelectingComment;
  }

  getCreatingNewCommentForm() {
    return this._createNewCommentForm;
  }

  getRatingChangeButton() {
    return this._ratingChangeButton;
  }

  getEmptyEmojiContainer() {
    return this._emptyEmojiContainer;
  }

  setPopupCloseButtonClickHandler() {
    this._popupComponent.setCloseButtonClickHandler(() => {
      this._replacePopupToCard();
      this._popupComponent.getElement().remove();
      this._popupComponent.removeElement();
    });
  }

  render(movie, container = this._container) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._movie = movie;
    this._cardComponent = new CardComponent(movie);
    this._popupComponent = new PopupComponent(movie);

    const popupMiddleContainer = this._popupComponent.getElement().querySelector(`.form-details__middle-container`);

    const popupUserRating = this._popupComponent.getElement().querySelector(`.film-details__user-rating`);

    const addEventListenerToComponent = (popContainer, card, popup) => {
      const onEscKeyPress = (evt) => {
        const isEscKey = evt.keyCode === Keycodes.ESCAPE;

        if (isEscKey) {
          this._replacePopupToCard();

          popup.getElement().remove();
          popup.removeElement();

          document.removeEventListener(`keydown`, onEscKeyPress);
        }
      };

      const keysPressed = {};

      const onCtrlEnterPress = (event) => {
        keysPressed[event.keyCode] = true;

        const isEmojiExistInList = Object.values(EmojiIds).includes(this._emptyCommentEmoji);

        const commentArea = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
        commentArea.removeAttribute(`disabled`);
        commentArea.style = `border: 0px solid red`;

        const commentAreaText = commentArea.value;

        const newCommentText = he.encode(commentAreaText);
        const newCommentEmoji = this._emptyCommentEmoji;


        if (keysPressed[Keycodes.CTRL] && event.keyCode === Keycodes.ENTER
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

      document.addEventListener(`keydown`, onEscKeyPress);
    };

    const addToWatchlistButtonHanlder = () => {
      const newMovie = MovieModel.clone(movie);
      newMovie.comments = movie.comments;
      newMovie.userDetails.watchlist = !newMovie.userDetails.watchlist;

      this._onDataChange(this, movie, newMovie);
      this._onFiltersChange();
    };

    this._cardComponent.setAddToWatchlistButtonCLickHandler(() => {
      event.preventDefault();
      debounce(addToWatchlistButtonHanlder(), DEBOUNCE_TIMEOUT);
    });

    const markWatchedButtonClickHandler = () => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.alreadyWatched = !newMovie.userDetails.alreadyWatched;

      if (newMovie.userDetails.alreadyWatched) {
        newMovie.userDetails.watchingDate = getCurrentDateIsoFormat();
      }

      this._onDataChange(this, movie, newMovie);
      this._onFiltersChange();
    };

    this._cardComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      debounce(markWatchedButtonClickHandler(), DEBOUNCE_TIMEOUT);
    });

    const setFavoriteButtonClickHandler = () => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.favorite = !newMovie.userDetails.favorite;

      this._onDataChange(this, movie, newMovie);
      this._onFiltersChange();
    };

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      event.preventDefault();
      debounce(setFavoriteButtonClickHandler(), DEBOUNCE_TIMEOUT);
    });

    this._popupComponent.setAddToWatchlistButtonCLickHandler(() => {
      debounce(addToWatchlistButtonHanlder(), DEBOUNCE_TIMEOUT);
    });

    this._popupComponent.setUndoRatingButtonClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.alreadyWatched = false;
      newMovie.userDetails.personalRating = RATING_ZERO;

      this._onFiltersChange();
      this._onDataChange(this, movie, newMovie);

      popupUserRating.classList.add(`visually-hidden`);
    });

    const markWatchedHandler = (checked = true) => {
      const popupElement = this._popupComponent.getElement();
      const watchedInputElement = popupElement.querySelector(`#watched`);

      watchedInputElement.toggleAttribute(`checked`, checked);
    };

    const markWatchedButtonClickHandlerPopup = () => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.alreadyWatched = !newMovie.userDetails.alreadyWatched;

      markWatchedHandler(newMovie.userDetails.alreadyWatched);

      this._onDataChange(this, movie, newMovie);
      this._onFiltersChange();

      popupMiddleContainer.classList.toggle(`visually-hidden`);
    };

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      debounce(markWatchedButtonClickHandlerPopup(), DEBOUNCE_TIMEOUT);
    });

    const setFavoriteButtonClickHandlerPopup = () => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.favorite = !newMovie.userDetails.favorite;

      this._onFiltersChange();
      this._onDataChange(this, movie, newMovie);
    };

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      debounce(setFavoriteButtonClickHandlerPopup(), DEBOUNCE_TIMEOUT);
    });

    this._popupComponent.setUserRatingChangeHandler((evt) => {
      event.preventDefault();
      const target = evt.target;
      this._ratingChangeButton = target;
      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = parseInt(target.value, RADIX_DECIMAL);
      newMovie.userDetails.alreadyWatched = true;

      if (newMovie.userDetails.alreadyWatched) {
        newMovie.userDetails.watchingDate = `${getCurrentDateIsoFormat()}`;
      } else {
        newMovie.userDetails.watchingDate = null;
      }

      popupUserRating.classList.remove(`visually-hidden`);
      target.setAttribute(`disabled`, `true`);
      target.style = `background-color: white`;
      this._onUserRatingChange(popupUserRating, newMovie.userDetails.personalRating);
      Promise.resolve(this._onDataChange(this, movie, newMovie))
        .then(() => {
          target.removeAttribute(`disabled`);
        })
        .catch(() => {
          target.removeAttribute(`disabled`);
          target.style = `background-color: red`;
          this.shake();
        });
    });

    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      addEventListenerToComponent(this._popupContainer, this._cardComponent, this._popupComponent);
    } else {
      render(container, this._cardComponent.getElement(), RenderPosition.AFTERBEGIN);
    }

    addEventListenerToComponent(this._popupContainer, this._cardComponent, this._popupComponent);
  }

  renderNewCommentForm() {
    let newCommentForm = this.getCreatingNewCommentForm();
    newCommentForm.value = ``;
  }

  renderCommentsCount(count) {
    const popupElement = this._popupComponent.getElement();
    const commentsCountElement = popupElement.querySelector(`.film-details__comments-count`);

    commentsCountElement.innerHTML = `${count}`;
  }

  renderComments(popupCommentsList, commentsListElement) {
    const popupComponent = this._popupComponent;

    this.renderCommentsCount(popupCommentsList.length);

    popupCommentsList.slice(0, popupCommentsList.length)
    .forEach((comment) => {
      const currentComment = new CommentComponent(comment);

      render(commentsListElement, currentComment.getElement(), RenderPosition.BEFOREEND);

      this._addCommentsHandlers(currentComment, comment.id, commentsListElement);
    });

    popupComponent.setEmojiItemClickHandlers(() => {
      const bigEmojiContainer = popupComponent.getElement().querySelector(`.big-emoji`);
      this._emptyEmojiContainer = bigEmojiContainer;
      this._emptyCommentEmoji = this._onEmojiChange(event.target.id, bigEmojiContainer);
    });
  }

  renderPopup() {
    const popupData = this._movie;
    render(this._popupContainer.getElement(), this._popupComponent.getElement(), RenderPosition.BEFOREEND);
    const popupElement = this._popupContainer.getElement().querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = popupData.comments;

    this.setPopupCloseButtonClickHandler();

    if (popupData.userDetails.alreadyWatched) {
      this.renderUserRating(popupElement);
    }
    this.renderComments(popupCommentsList, commentsListElement);
  }

  renderUserRating(popupElement) {
    const popupUserRating = popupElement.querySelector(`.film-details__user-rating`);
    popupUserRating.classList.remove(`visually-hidden`);
  }

  newCommentDeliveryError(target) {
    target.style = `border: 1px solid red`;
  }

  shake() {
    this._popupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._popupComponent.getElement().style.animation = ``;

    }, SHAKE_ANIMATION_TIMEOUT);
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

  _removeComments(list) {
    const commentsList = list;
    commentsList.innerHTML = ``;
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
}
