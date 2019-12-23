import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentComponent from '../components/comment.js';
import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onFiltersChange, onUserRatingChange, onViewChange) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._mode = Mode.DEFAULT;

    this._cardComponent = null;
    this._popupComponent = null;
    this._onDataChange = onDataChange;
    this._onFiltersChange = onFiltersChange;
    this._onUserRatingChange = onUserRatingChange;
    this._onViewChange = onViewChange;

    this._setDefaultView = this._setDefaultView;
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
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardComponent(data);
    render(container, this._cardComponent.getElement(), RenderPosition.AFTERBEGIN);

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

        render(popContainer.getElement(), popup.getElement(), RenderPosition.BEFOREEND);
        const popupElement = popContainer.getElement().querySelector(`.film-details`);
        const commentsListElement = popupElement.querySelector(`.film-details__comments-list`);
        const popupCommentsList = data.comments;
        popupCommentsList.slice(0, popupCommentsList.length)
          .forEach((comment) => render(commentsListElement, new CommentComponent(comment).getElement(), RenderPosition.BEFOREEND));

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
      data.isOnWatchList = !data.isOnWatchList;
      this._onDataChange(this, oldPopupComponent, this._popupComponent);
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

      this._onDataChange(this, oldPopupComponent, this._popupComponent);
    });

    this._popupComponent.setFavoriteButtonClickHandler(() => {
      data.isFavorite = !data.isFavorite;
      this._onDataChange(this, oldPopupComponent, this._popupComponent);
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
