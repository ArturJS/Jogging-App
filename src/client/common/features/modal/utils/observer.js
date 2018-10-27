export default class Observer {
  constructor() {
    this._subscribers = [];
  }

  subscribe(fn) {
    this._subscribers.push(fn);
  }

  unsubscribe(fn) {
    this._subscribers = this._subscribers.filter(sub => sub !== fn);
  }

  trigger(...args) {
    this._subscribers.forEach(fn => fn(...args));
  }
}
