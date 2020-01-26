const CARD_COUNT = 22;

const NameItems = [
  `Побег из Шоушенка`,
  `Крестный отец`,
  `Крестный отец 2`,
  `Темный рыцарь`,
  `12 разгневанных мужчин`,
  `Список Шиндлера`,
  `Властелин колец: Возвращение короля`,
  `Криминальное чтиво`,
  `Хороший, плохой, злой`,
  `Бойцовский клуб`,
  `Властелин колец: Братство кольца`,
  `Форрест Гамп`,
  `Начало`,
  `Звёздные войны. Эпизод 5: Империя наносит ответный удар`,
  `Властелин колец: Две крепости`,
];

const PosterItems = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const DescriptionItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ********
  *******************
  &&&&&&&&&&555&&`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const GenreItems = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Biography`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Family`,
  `Fantasy`,
  `Film-noir`,
  `History`,
  `Horror`,
  `Music`,
  `Mystery`,
  `Romance`,
  `Sci-Fi`,
  `Sport`,
  `Thriller`,
  `War`,
  `Western`,
];

const MonthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const FilterType = {
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  ALL: `all movies`,
};

const EMOJI_ID = {
  SMILE: {
    ID: `emoji-smile`,
    VALUE: `smile`,
    SRC: `images/emoji/smile.png`,
  },
  SLEEPING: {
    ID: `emoji-sleeping`,
    VALUE: `sleeping`,
    SRC: `images/emoji/sleeping.png`,
  },
  GRINNING: {
    ID: `emoji-gpuke`,
    VALUE: `puke`,
    SRC: `images/emoji/puke.png`,
  },
  ANGRY: {
    ID: `emoji-angry`,
    VALUE: `angry`,
    SRC: `images/emoji/angry.png`,
  },
};

const EMOJI_IDS = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  GRINNING: `puke`,
  ANGRY: `angry`,
};

const STATISTIC_FILTERS_ID = {
  ALL_TIME: `statistic-all-time`,
  TODAY: `statistic-today`,
  WEEK: `statistic-week`,
  MONTH: `statistic-month`,
  YEAR: `statistic-year`,
};

const RADIX_DECIMAL = 10;

export {CARD_COUNT, NameItems, PosterItems, DescriptionItems,
  GenreItems, MonthNames, FilterType, EMOJI_ID, EMOJI_IDS,
  STATISTIC_FILTERS_ID, RADIX_DECIMAL};
