// @flow

import type { Node } from 'react';
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

type TCloseFn = (reason?: string) => void;

type TModalResult = {|
    result: Promise<string>,
    close: TCloseFn
|};

type TModalConfig = {|
    title?: string,
    body: string | Node,
    className?: string
|};

type TModalType = $Values<typeof MODAL_TYPES>;

type TModalOpenConfig = {|
    ...TModalConfig,
    type: TModalType,
    noBackdrop?: boolean
|};

class Modal {
    id: number;

    title: string;

    body: string | Node;

    type: TModalType;

    close: TCloseFn;

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
        className = '',
        shouldCloseOnOverlayClick = true,
        noBackdrop = false
    }) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.type = type;
        this.close = close;
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

    confirm({ title, body, className }: TModalConfig) {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.confirm,
            className
        });

        return {
            result,
            close
        };
    }

    error({ title, body, className = '' }: TModalConfig): TModalResult {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.error,
            className: `modal-error ${className}`,
            noBackdrop: true
        });

        return {
            result,
            close
        };
    }

    custom({ title, body, className }: TModalConfig): TModalResult {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.custom,
            className
        });

        return {
            result,
            close
        };
    }

    async closeAll(reason?: string) {
        const { modals }: { modals: Array<Modal> } = this._store.getState();

        modals.forEach(modal => {
            // eslint-disable-next-line no-param-reassign
            modal.isOpen = false;
            modal.close(reason);
        });

        await sleep(CLOSE_DELAY_MS);

        this._store.setState({ modals: [] });
    }

    subscribe(callback: (state: TState) => void): () => void {
        callback(this._store.getState());

        return this._store.subscribe(callback);
    }

    _openModal({
        title,
        body,
        type,
        className,
        noBackdrop
    }: TModalOpenConfig): TModalResult {
        let close = () => {};
        const result = new Promise(resolve => {
            close = resolve;
        });
        const id = generateId();
        const newModal = new Modal({
            id,
            title,
            body,
            type,
            className,
            close,
            noBackdrop,
            shouldCloseOnOverlayClick: true
        });

        this._store.setState(({ modals }: { modals: Array<Modal> }) => ({
            modals: [...modals, newModal]
        }));

        result.then((reason: string) => this.closeModal({ id, reason }));

        return {
            result,
            close
        };
    }

    async closeModal({ id, reason }: { id: number, reason?: string }) {
        const { modals }: { modals: Array<Modal> } = this._store.getState();
        const modalToClose = modals.find(modal => modal.id === id);

        if (!modalToClose) {
            return;
        }

        modalToClose.isOpen = false;
        modalToClose.close(reason);

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
