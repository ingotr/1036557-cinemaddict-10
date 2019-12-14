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
    const filmPopUp = popContainer.querySelector(`.film-details`);
    filmPopUp.remove();
    popup.getElement().remove();
    popup.removeElement();
  };

  const onPopupOpen = () => {
    render(popContainer, popup.getElement(), RenderPosition.BEFOREEND);
    const popupElement = popContainer.querySelector(`.film-details`);
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
  constructor(container, popupContainer, onDataChange) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._onDataChange = onDataChange;
  }

  render(data, container = this._container) {
    const currentCardComponent = new CardComponent(data);
    render(container, currentCardComponent.getElement(), RenderPosition.AFTERBEGIN);

    const currentPopupComponent = new PopupComponent(data);
    addEventListenerToComponent(this._popupContainer, currentCardComponent, currentPopupComponent, data);
  }
}
