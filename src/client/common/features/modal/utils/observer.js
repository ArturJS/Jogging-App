// @flow

// eslint-disable-next-line flowtype/no-weak-types
type TNotifyPayload = Array<any>;
type TSubscribeFn = (...args: TNotifyPayload) => void;

export default class Observer {
    _subscribers: Array<TSubscribeFn>;

    constructor() {
        this._subscribers = [];
    }

    subscribe(fn: TSubscribeFn) {
        this._subscribers.push(fn);
    }

    unsubscribe(fn: TSubscribeFn) {
        this._subscribers = this._subscribers.filter(sub => sub !== fn);
    }

    notify(...args: TNotifyPayload) {
        this._subscribers.forEach(fn => fn(...args));
    }
}
