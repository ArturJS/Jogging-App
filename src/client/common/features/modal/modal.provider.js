// @flow

import type { Element } from 'react';
import sleep from './utils/sleep';
import { createStore, Store } from './utils/store';

export const MODAL_TYPES = {
    error: 'ERROR_MODAL',
    confirm: 'CONFIRM_MODAL',
    info: 'INFO_MODAL',
    custom: 'CUSTOM_MODAL'
};
// it's necessary to perform exit animation in modal-dialog.jsx
export const CLOSE_DELAY_MS = 300;

let modalId = 0;
const generateId = () => {
    modalId += 1;

    return modalId;
};

// eslint-disable-next-line flowtype/no-weak-types
type TReason = mixed;

type TCloseFn = (reason?: TReason) => void;

type TDismissFn = (reason?: TReason) => void;

// eslint-disable-next-line flowtype/no-weak-types
type TBody = string | Element<any>;

type TModalResult = {|
    result: Promise<TReason>,
    close: TCloseFn
|};

type TModalConfig = {|
    title?: string,
    body: TBody,
    className?: string,
    throwCancelError?: boolean
|};

type TModalType = $Values<typeof MODAL_TYPES>;

type TModalOpenConfig = {|
    ...TModalConfig,
    type: TModalType,
    noBackdrop?: boolean
|};

class CancelError extends Error {}

export class Modal {
    id: number;

    title: string;

    body: TBody;

    type: TModalType;

    close: TCloseFn;

    dismiss: TDismissFn;

    className: string;

    shouldCloseOnOverlayClick: ?boolean;

    noBackdrop: boolean;

    isOpen: boolean;

    constructor({
        id,
        title = '',
        body,
        type,
        close = () => {},
        dismiss = () => {},
        className = '',
        shouldCloseOnOverlayClick = true,
        noBackdrop = false
    }: {|
        id: number,
        title: string,

        // eslint-disable-next-line flowtype/no-weak-types
        body: string | Element<any>,
        type: TModalType,
        close: TCloseFn,
        dismiss: TDismissFn,
        className: string,
        shouldCloseOnOverlayClick?: boolean,
        noBackdrop: boolean
    |}) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.type = type;
        this.close = close;
        this.dismiss = dismiss;
        this.className = className;
        this.shouldCloseOnOverlayClick = shouldCloseOnOverlayClick;
        this.noBackdrop = noBackdrop;
        this.isOpen = true;
    }
}

type TState = {|
    modals: Array<Modal>
|};

export class ModalProvider {
    _store: Store;

    constructor() {
        this._store = createStore({
            modals: []
        });
    }

    confirm({ title, body, className, throwCancelError }: TModalConfig) {
        const { result, close } = this._performOpen({
            title,
            body,
            throwCancelError,
            type: MODAL_TYPES.confirm,
            className
        });

        return {
            result,
            close
        };
    }

    error({
        title,
        body,
        className = '',
        throwCancelError
    }: TModalConfig): TModalResult {
        const { result, close } = this._performOpen({
            title,
            body,
            throwCancelError,
            type: MODAL_TYPES.error,
            className: `modal-error ${className}`,
            noBackdrop: true
        });

        return {
            result,
            close
        };
    }

    custom({
        title,
        body,
        className,
        throwCancelError
    }: TModalConfig): TModalResult {
        const { result, close } = this._performOpen({
            title,
            body,
            throwCancelError,
            type: MODAL_TYPES.custom,
            className
        });

        return {
            result,
            close
        };
    }

    subscribe(callback: (state: TState) => void): () => void {
        callback(this._store.getState());

        return this._store.subscribe(callback);
    }

    async closeAll(reason?: TReason) {
        await this._performCloseAll({ reason, isClose: true });
    }

    async dismissAll(reason?: TReason) {
        await this._performCloseAll({ reason, isClose: false });
    }

    async close({ id, reason }: { id: number, reason?: TReason }) {
        await this._performClose({ id, reason, isClose: true });
    }

    async dismiss({ id, reason }: { id: number, reason?: TReason }) {
        await this._performClose({ id, reason, isClose: false });
    }

    _performOpen({
        title = '',
        body,
        type,
        className = '',
        throwCancelError = false,
        noBackdrop = false
    }: TModalOpenConfig): TModalResult {
        let close = () => {};
        let dismiss = () => {};
        const proxyResult = new Promise((resolve, reject) => {
            close = resolve;
            dismiss = reject;
        });
        const id = generateId();
        const newModal: Modal = new Modal({
            id,
            title,
            body,
            type,
            className,
            close,
            dismiss,
            noBackdrop,
            shouldCloseOnOverlayClick: true
        });

        this._store.setState(({ modals }: { modals: Array<Modal> }) => ({
            modals: [...modals, newModal]
        }));

        const result = proxyResult
            .then((reason?: TReason) => {
                this.close({ id, reason });

                return reason;
            })
            .catch((reason?: TReason = new CancelError()) => {
                this.dismiss({ id, reason });

                if (reason instanceof CancelError) {
                    if (throwCancelError) {
                        throw new CancelError();
                    }
                } else {
                    throw reason;
                }
            });

        return {
            result,
            close
        };
    }

    async _performCloseAll({
        reason,
        isClose
    }: {
        reason?: TReason,
        isClose: boolean
    }) {
        const { modals }: { modals: Array<Modal> } = this._store.getState();

        modals.forEach(modal => {
            // eslint-disable-next-line no-param-reassign
            modal.isOpen = false;

            if (isClose) {
                modal.close(reason);
            } else {
                modal.dismiss(reason);
            }
        });

        await sleep(CLOSE_DELAY_MS);

        this._store.setState({ modals: [] });
    }

    async _performClose({
        id,
        reason,
        isClose
    }: {
        id: number,
        reason?: TReason,
        isClose: boolean
    }) {
        const { modals }: { modals: Array<Modal> } = this._store.getState();
        const modalToClose = modals.find(modal => modal.id === id);

        if (!modalToClose) {
            return;
        }

        modalToClose.isOpen = false;

        if (isClose) {
            modalToClose.close(reason);
        } else {
            modalToClose.dismiss(reason);
        }

        this._store.setState({
            // necessary to trigger update
            modals: [...modals]
        });

        await sleep(CLOSE_DELAY_MS);

        this._store.setState({
            modals: modals.filter(modal => modal.id !== id)
        });
    }
}

export default new ModalProvider();
