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

  render(data, container = this._container) {
    this._cardComponent = new CardComponent(data);
    render(container, this._cardComponent.getElement(), RenderPosition.AFTERBEGIN);

    this._cardComponent.setAddToWatchlistButtonCLickHandler(() => {
      event.preventDefault();
      if (data.isOnWatchList) {
        this._onFiltersChange(`watchlist`, false);
      } else {
        this._onFiltersChange(`watchlist`, true);
      }
    });
    this._cardComponent.setMarkAsWatchedButtonClickHandler(() => {
      event.preventDefault();
      if (data.isWatched) {
        this._onFiltersChange(`history`, false);
      } else {
        this._onFiltersChange(`history`, true);
      }
    });
    this._cardComponent.setFavoriteButtonClickHandler(() => {
      event.preventDefault();
      if (data.isFavorite) {
        this._onFiltersChange(`favorites`, false);
      } else {
        this._onFiltersChange(`favorites`, true);
      }
    });

    this._popupComponent = new PopupComponent(data);
    addEventListenerToComponent(this._popupContainer, this._cardComponent, this._popupComponent, data);
  }
}
