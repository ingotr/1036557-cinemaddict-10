const getUserRank = (numbWatchedFilms) => {
  const rank = 0;
  switch (numbWatchedFilms) {
    case 0:
      rank = ``;
      return rank;
    case ((numbWatchedFilms > 1) && (numbWatchedFilms <= 10)):
      rank = `novice`;
      return rank;
    case ((numbWatchedFilms >= 11) && (numbWatchedFilms <= 20)):
      rank = `fan`;
      return rank;
    case (numbWatchedFilms >= 21):
      rank = `movie buff`;
      return rank;
  }
  return rank;
};

export const createUserRankTemplate = (number) => {
  const rank = getUserRank(number);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
