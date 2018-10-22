class PubSub {
  _listeners = {};

  on(eventName, callback) {
    this._listeners[eventName];

    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }

    this._listeners[eventName].push(callback);

    return () => {
      this._listeners[eventName] = this._listeners[eventName].filter(
        cb => cb !== callback
      );
    };
  }

  trigger(eventName, ...args) {
    if (!this._listeners[eventName]) {
      return;
    }

    this._listeners[eventName].forEach(callback => {
      callback(...args);
    });
  }
}

export const MODAL_TYPES = {
  confirm: 'CONFIRM_MODE',
  custom: 'CUSTOM_MODE'
};

class ModalManager {
  title;
  body;
  isOpen;
  modalType;
  modalClassName;
  noBackdrop;
  buttons;
  pubsub;
  _modalResult;
  _resolve;

  constructor() {
    this.pubsub = new PubSub();
    this._resetFields();
  }

  showConfirm({ title, body, className }) {
    this._showModal({
      title,
      body,
      modalType: MODAL_TYPES.confirm,
      className: `modal-info ${className}`
    });

    return this._modalResult;
  }

  showCustom({ title = '', component, className = '' }) {
    this._showModal({
      title,
      body: component,
      modalType: MODAL_TYPES.custom,
      className: `modal-custom ${className}`
    });

    return this._modalResult;
  }

  close(result = false) {
    this._resolve(result);
    this._resetFields();
    this.pubsub.trigger('toggleModal', false);
  }

  _resetFields() {
    this.title = null;
    this.body = null;
    this.isOpen = false;
    this.modalType = null;
    this.modalClassName = null;
    this._modalResult = new Promise(res => {
      this._resolve = res;
    });
    this.noBackdrop = false;
    this.buttons = {
      ok: 'OK',
      cancel: 'Cancel'
    };
  }

  _showModal({ title, body, modalType, className, noBackdrop }) {
    this.isOpen = true;
    this.title = title;
    this.body = body;
    this.modalType = modalType;
    this.noBackdrop = noBackdrop;
    this.modalClassName = className;
    this.buttons = {
      ok: 'OK',
      cancel: 'Cancel'
    };
    this.pubsub.trigger('toggleModal', true);
  }
}

export default new ModalManager();
