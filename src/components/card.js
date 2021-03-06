import AbstractComponent from './abstract-component.js';
import {getFormattedRuntime, getYearFromIso} from '../utils/common.js';
import {Description} from '../const.js';

const createButtonMarkup = (name, description, isActive) => {
  return (
    `<button class="film-card__controls-item button
    film-card__controls-item--${name} ${isActive ? `film-card__controls-item--active` : ``}">${description}</button>`
  );
};

const createDefaultCardTemplate = (card) => {
  const {comments, filmInfo, userDetails} = card;
  const {
    title,
    totalRating,
    poster,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;

  const {watchlist, alreadyWatched, favorite} = userDetails;

  const {date} = release;

  const formattedRuntime = getFormattedRuntime(runtime);

  const formattedDate = getYearFromIso(date);

  let currentDescription = (description.length > Description.MAX_LENGTH) ?
    description.slice(0, Description.MAX_LENGTH) + Description.ELLIPSIS : description;

  const addToWatchlistButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, watchlist);
  const markAsWatchedButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, alreadyWatched);
  const markAsFavoriteButton = createButtonMarkup(`favorite`, `Mark as favorite`, favorite);

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
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}

