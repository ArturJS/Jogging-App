import Observer from './observer';

class Store {
  constructor(initialState) {
    this._state = initialState;
    this._observer = new Observer();
  }

  subscribe(callback) {
    this._observer.subscribe(callback);

    return () => {
      this._observer.unsubscribe(callback);
    };
  }

  getState() {
    return this._state;
  }

  setState(nextStateOrUpdateFn) {
    const nextState = this._extractNextState(nextStateOrUpdateFn);

    if (!nextState) {
      // eslint-disable-next-line no-console
      console.error(
        [
          '`setState` method waiting for object or function but got: ',
          `value: ${nextStateOrUpdateFn}`,
          `typeof: ${typeof nextStateOrUpdateFn}`
        ].join('')
      );

      return;
    }

    this._mergeNextState(nextState);

    this._notifySubscribers(this.getState());
  }

  _notifySubscribers(state) {
    this._observer.trigger(state);
  }

  _extractNextState(nextStateOrUpdateFn) {
    if (typeof nextStateOrUpdateFn === 'function') {
      const updateFn = nextStateOrUpdateFn;
      const nextState = updateFn(this.getState());

      return nextState;
    }

    if (nextStateOrUpdateFn && typeof nextStateOrUpdateFn === 'object') {
      const nextState = nextStateOrUpdateFn;

      return nextState;
    }

    return null;
  }

  _mergeNextState(nextState) {
    this._state = {
      ...this._state,
      ...nextState
    };
  }
}

export const createStore = initialState => new Store(initialState);
