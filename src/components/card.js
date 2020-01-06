import AbstractComponent from './abstract-component.js';

const createButtonMarkup = (name, description, isActive) => {
  return (
    `<button class="film-card__controls-item button
    film-card__controls-item--${name} ${isActive ? `` : `film-card__controls-item--active`}">${description}</button>`
  );
};

const createDefaultCardTemplate = (card) => {
  const {title, rating, year, duration, genres, poster, description, comments} = card;

  const addToWatchlistButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, true);
  const markAsWatchedButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, card.isWatched);
  const markAsFavoriteButton = createButtonMarkup(`favorite`, `Mark as favorite`, card.isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}…</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          ${addToWatchlistButton}
          ${markAsWatchedButton}
          ${markAsFavoriteButton}
        </form>
    </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createDefaultCardTemplate(this._card);
  }

  setCardElementsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonCLickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}

