import Api from './api/index.js';
import Store from './api/store.js';
import StoreComments from './api/store-comments.js';
import Provider from './api/provider.js';
import MoviesModel from './models/movies.js';
import PageControllerComponent from './controllers/page.js';

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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.syncMovies()
      .then(() => {
      })
      .catch(() => {
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const storeComments = new StoreComments(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store, storeComments);

const mainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();

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
