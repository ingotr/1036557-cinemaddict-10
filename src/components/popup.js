import AbstractSmartComponent from './abstract-smart-component';
import {getFormattedRuntime, getDateFromIso} from '../utils/common.js';
import {Description} from '../const.js';

const GenreTitle = {
  LONG: `Genres`,
  SHORT: `Genre`,
};

const createGenresMarkup = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createInputMarkup = (name, isChecked) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked ? `checked` : ``}>`
  );
};

const createPopUpTemplate = (popup) => {
  const {comments, filmInfo, userDetails} = popup;
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;

  const {date, releaseCountry} = release;

  const {personalRating, watchlist, alreadyWatched, favorite} = userDetails;

  const formattedRuntime = getFormattedRuntime(runtime);

  const formattedDate = getDateFromIso(date);

  const genresList = createGenresMarkup(genre);

  let genreListTitle = genre.length > 1 ? GenreTitle.LONG : GenreTitle.SHORT;

  let currentDescription = (description.length > Description.MAX_LENGTH) ?
    description.slice(0, Description.MAX_LENGTH) + Description.ELLIPSIS : description;

  const addToWatchlistInput = createInputMarkup(`watchlist`, watchlist);
  const markAsWatchedInput = createInputMarkup(`watched`, alreadyWatched);
  const markAsFavoriteInput = createInputMarkup(`favorite`, favorite);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                  <p class="film-details__user-rating visually-hidden">Your rate ${personalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formattedDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formattedRuntime.digits.hours}${formattedRuntime.labels.HOURS}
                  ${formattedRuntime.digits.minutes}${formattedRuntime.labels.MINUTES}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreListTitle}</td>
                  <td class="film-details__cell">
                    ${genresList}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${currentDescription}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${addToWatchlistInput}
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            ${markAsWatchedInput}
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            ${markAsFavoriteInput}
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

      <div class="form-details__middle-container visually-hidden">
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <button class="film-details__watched-reset" type="button">Undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                <label class="film-details__user-rating-label" for="rating-1">1</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                <label class="film-details__user-rating-label" for="rating-2">2</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                <label class="film-details__user-rating-label" for="rating-3">3</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                <label class="film-details__user-rating-label" for="rating-4">4</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
                <label class="film-details__user-rating-label" for="rating-5">5</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                <label class="film-details__user-rating-label" for="rating-6">6</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                <label class="film-details__user-rating-label" for="rating-7">7</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                <label class="film-details__user-rating-label" for="rating-8">8</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked="">
                <label class="film-details__user-rating-label" for="rating-9">9</label>

              </div>
            </section>
          </div>
        </section>
      </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img class="big-emoji visually-hidden" src="images/emoji/smile.png" width="55" height="55" alt="emoji">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
    </form>
  </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(popup) {
    super();

    this._popup = popup;
  }

  getTemplate() {
    return createPopUpTemplate(this._popup);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this.rerender();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonCLickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }

  setUserRatingChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`change`, handler);
  }

  setEmojiItemClickHandlers(handler) {
    const emojiItemList = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    emojiItemList.forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  setSubmitCommentFormHandler(handler) {
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`submit`, handler);
  }

  setUndoRatingButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, handler);
  }

  _subscribeOnEvents() {
    this.setCloseButtonClickHandler();
    this.setAddToWatchlistButtonCLickHandler();
    this.setMarkAsWatchedButtonClickHandler();
    this.setFavoriteButtonClickHandler();
  }
}
