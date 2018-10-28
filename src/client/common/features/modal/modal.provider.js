import { sleep, createStore } from './utils';

export const MODAL_TYPES = {
  error: 'ERROR_MODAL',
  confirm: 'CONFIRM_MODAL',
  info: 'INFO_MODAL',
  custom: 'CUSTOM_MODAL'
};
// it's necessary to perform exit animation in modal-dialog.jsx
export const CLOSE_DELAY_MS = 300;

let id = 0;
const generateId = () => ++id;

class Modal {
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

class ModalProvider {
  constructor() {
    this._store = createStore({
      modals: []
    });
  }

  showConfirm({ title, body, className }) {
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

  showError({ title, body, className = '' }) {
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

  showCustom({ title, body, className }) {
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

  async closeAll(reason) {
    const { modals } = this._store.getState();

    modals.forEach(modal => {
      modal.isOpen = false;
      modal.close(reason);
    });

    await sleep(CLOSE_DELAY_MS);

    this._store.setState({ modals: [] });
  }

  subscribe(callback) {
    callback(this._store.getState());

    return this._store.subscribe(callback);
  }

  _openModal({ title, body, type, className, noBackdrop }) {
    let close;
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
      noBackdrop
    });

    this._store.setState(({ modals }) => ({
      modals: [...modals, newModal]
    }));

    result.then(reason => this.closeModal({ id, reason }));

    return {
      result,
      close
    };
  }

  async closeModal({ id, reason }) {
    const { modals } = this._store.getState();
    const modalToClose = modals.find(modal => modal.id === id);

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
