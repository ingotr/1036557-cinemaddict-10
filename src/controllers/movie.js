import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import {render, RenderPosition} from '../utils/render.js';

const addEventListenerToComponent = (popContainer, card, popup, data) => {
  const onEscKeyPress = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      onPopUpClose(popup);
      document.removeEventListener(`keydown`, onEscKeyPress);
    }
  };

  const onPopUpClose = () => {
    const filmPopUp = popContainer.getElement().querySelector(`.film-details`);
    filmPopUp.remove();
    popup.getElement().remove();
    popup.removeElement();
  };

  const onPopupOpen = () => {
    render(popContainer.getElement(), popup.getElement(), RenderPosition.BEFOREEND);
    const popupElement = popContainer.getElement().querySelector(`.film-details`);
    const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
    const popupCommentsList = data.comments;
    popupCommentsList.slice(0, popupCommentsList.length)
      .forEach((comment) => render(commentsListElement, new CommentComponent(comment).getElement(), RenderPosition.BEFOREEND));

    document.addEventListener(`keydown`, onEscKeyPress);
  };

  card.setCardElementsClickHandler(onPopupOpen);

  popup.setCloseButtonClickHandler(onPopUpClose);
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onFiltersChange) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._cardComponent = null;
    this._popupComponent = null;
    this._onDataChange = onDataChange;
    this._onFiltersChange = onFiltersChange;
  }

  _watchListButtonClickHandler(data) {
    if (data.isOnWatchList) {
      this._onFiltersChange(`watchlist`, false);
      data.isOnWatchList = !data.isOnWatchList;
    } else {
      this._onFiltersChange(`watchlist`, true);
      data.isOnWatchList = !data.isOnWatchList;
    }
  }

  _markWatchedButtonClickHandler(data) {
    if (data.isWatched) {
      this._onFiltersChange(`history`, false);
      data.isWatched = !data.isWatched;
    } else {
      this._onFiltersChange(`history`, true);
      data.isWatched = !data.isWatched;
    }
  }

  _setFavoriteButtonClickHandler(data) {
    if (data.isFavorite) {
      this._onFiltersChange(`favorites`, false);
      data.isFavorite = !data.isFavorite;
    } else {
      this._onFiltersChange(`favorites`, true);
      data.isFavorite = !data.isFavorite;
    }
  }

  render(data, container = this._container) {
    this._cardComponent = new CardComponent(data);
    render(container, this._cardComponent.getElement(), RenderPosition.AFTERBEGIN);

    this._popupComponent = new PopupComponent(data);
    const popupMiddleContainer = this._popupComponent.getElement().querySelector(`.form-details__middle-container`);
    const popupUserRatingPanel = this._popupComponent.getElement().querySelector(`.film-details__user-rating-score`);

    const popupUserRating = this._popupComponent.getElement().querySelector(`.film-details__user-rating`);

    this._cardComponent.setAddToWatchlistButtonCLickHandler(() => {
      event.preventDefault();
      this._watchListButtonClickHandler(data);
    });
    this._cardComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      this._markWatchedButtonClickHandler(data);
    });
    this._cardComponent.setFavoriteButtonClickHandler(() => {
      event.preventDefault();
      this._setFavoriteButtonClickHandler(data);
    });

    this._popupComponent.setAddToWatchlistButtonCLickHandler(() => {
      this._watchListButtonClickHandler(data);
      popupMiddleContainer.classList.toggle(`visually-hidden`);

      if (data.userRating) {
        popupUserRating.classList.toggle(`visually-hidden`);
      }
    });

    this._popupComponent.setMarkAsWatchedButtonClickHandler(() => {
    });

    addEventListenerToComponent(this._popupContainer, this._cardComponent, this._popupComponent, data);
  }
}
