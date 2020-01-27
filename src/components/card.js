import AbstractComponent from './abstract-component.js';
import debounce from 'lodash/debounce';
import {getFormattedRuntime, getYearFromIso} from '../utils/common.js';

const DEBOUNCE_TIMEOUT = 1000;
const MAX_DESCRIPTION_LENGTH = 140;
const MAX_DESCRIPTION_ELLIPSIS = `\&#8230`;

const createButtonMarkup = (name, description, isActive) => {
  return (
    `<button class="film-card__controls-item button
    film-card__controls-item--${name} ${isActive ? `` : `film-card__controls-item--active`}">${description}</button>`
  );
};

const createDefaultCardTemplate = (card) => {
  const {comments, filmInfo} = card;
  const {
    title,
    totalRating,
    poster,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;

  const {date} = release;

  const formattedRuntime = getFormattedRuntime(runtime);

  const formattedDate = getYearFromIso(date);

  let currentDescription = (description.length > MAX_DESCRIPTION_LENGTH) ?
    description.slice(0, MAX_DESCRIPTION_LENGTH) + MAX_DESCRIPTION_ELLIPSIS : description;

  const addToWatchlistButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, true);
  const markAsWatchedButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, card.isWatched);
  const markAsFavoriteButton = createButtonMarkup(`favorite`, `Mark as favorite`, card.isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formattedDate}</span>
        <span class="film-card__duration">${formattedRuntime.digits.hours}${formattedRuntime.labels.HOURS}
        ${formattedRuntime.digits.minutes}${formattedRuntime.labels.MINUTES}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${currentDescription}</p>
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
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }
}

