export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderFilter = (filters, currentType, filterContainer, additive) => {
  const additiveValue = 1;
  if (additive) {
    filters[currentType].count -= additiveValue;
  } else {
    filters[currentType].count += additiveValue;
  }
  filterContainer.innerHTML = filters[currentType].count;
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
