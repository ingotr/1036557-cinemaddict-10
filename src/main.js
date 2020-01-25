import Api from './api/index.js';
import Store from './api/store.js';
import StoreComments from './api/store-comments.js';
import Provider from './api/provider.js';
import UserRankComponent from './components/user-rank.js';
import MoviesModel from './models/movies.js';
import PageControllerComponent from './controllers/page.js';
import {render, RenderPosition} from './utils/render.js';

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const STORE_COMMENTS_PREFIX = `cinemaddict-comments-localstorage`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_VER}`;

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
    })
    .catch(() => {
    });
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const storeComments = new StoreComments(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store, storeComments);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();

render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(mainElement, moviesModel, apiWithProvider);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);

apiWithProvider.getMovies()
  .then((movies) => {
    footerStatisticElement.textContent = `${movies.length} movies inside`;
    movies.map((it) => {
      apiWithProvider.getComments(it.id)
      .then((value) => {
        it.comments = value;
      });
    });
    return movies;
  })
  .then((movies) => {
    moviesModel.setMovies(movies);
    pageController.render();
    return movies;
  })
  .then(() => pageController.hideLoadingScreen());
