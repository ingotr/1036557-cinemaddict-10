const filmListVisuallyHidden = `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
const filmsSectionClass = `films-list`;

export const createFilmsListTemplate = (classTitle = filmsSectionClass, title = filmListVisuallyHidden) => (
  `<section class="${classTitle}">
    ${ title}
    <div class="films-list__container">
    </div>
  </section>`
);
