import AbstractComponent from './abstract-component.js';

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }
}
