import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  // ADDING: `adding`,
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

      card.setCardElementsClickHandler(() => {
        this._replaceCardToPopup();

        this.renderPopup();

        document.addEventListener(`keydown`, onEscKeyPress);
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
      this._onEmojiChange(event.target.id, bigEmojiContainer);
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

  _addCommentsHandlers(currentComment, commentIndex, commentContainer) {
    currentComment.setCommentsDeleteButtonClickHandler(() => {
      event.preventDefault();
      this._onCommentsCountChange(this, this._cardComponent, null, commentIndex, commentContainer);
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
}
