const CACHE_PREFIX = `cinemaddict-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `/images/emoji/angry.png`,
            `/images/emoji/puke.png`,
            `images/emoji/sleeping.png`,
            `/images/emoji/smile.png`,
            `/images/emoji/trophy.png`,
            `/imges/icons/icon-favorite-active.svg`,
            `/imges/icons/icon-favorite.svg`,
            `/imges/icons/icon-watched-active.svg`,
            `/imges/icons/icon-watched.svg`,
            `/imges/icons/icon-watchlist-active.svg`,
            `/imges/icons/icon-watchlist.svg`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
});

self.addEventListener(`fetch`, (evt) => {
});
