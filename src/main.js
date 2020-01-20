import API from './api.js';
import UserRankComponent from './components/user-rank.js';
import MoviesModel from './models/movies.js';
import PageControllerComponent from './controllers/page.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();

render(headerElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(mainElement, moviesModel);

const footerStatisticElement = document.querySelector(`.footer__statistics p`);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    movies.map((it) => {
      // console.log(it);
      api.getComments(it.id)
      .then(it.comments = Promise.resolve(api.getComments(it.id)));
    });
    pageController.render();
    footerStatisticElement.textContent = `${movies.length} movies inside`;
  });
