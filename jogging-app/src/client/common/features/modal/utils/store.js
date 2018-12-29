// @flow

import Observer from './observer';

// eslint-disable-next-line flowtype/no-weak-types
type TState = Object;

type TNextStateOrUpdateFn = TState | ((prevState: TState) => TState);

export class Store {
    _state: TState;

    _observer: Observer;

    constructor(initialState: TState) {
        this._state = initialState;
        this._observer = new Observer();
    }

    subscribe(callback: (state: TState) => void) {
        this._observer.subscribe(callback);

        return () => {
            this._observer.unsubscribe(callback);
        };
    }

    getState(): TState {
        return this._state;
    }

    setState(nextStateOrUpdateFn: TNextStateOrUpdateFn): void {
        const nextState = this._extractNextState(nextStateOrUpdateFn);

        this._mergeNextState(nextState);

        this._notifySubscribers(this.getState());
    }

    _notifySubscribers(state: TState) {
        this._observer.notify(state);
    }

    _extractNextState(nextStateOrUpdateFn: TNextStateOrUpdateFn): TState {
        if (typeof nextStateOrUpdateFn === 'function') {
            const updateFn = nextStateOrUpdateFn;
            const nextState = updateFn(this.getState());

            return nextState;
        }
        const nextState = nextStateOrUpdateFn;

        return nextState;
    }

    _mergeNextState(nextState: TState) {
        this._state = {
            ...this._state,
            ...nextState
        };
    }
}

export const createStore = (initialState: TState) => new Store(initialState);
