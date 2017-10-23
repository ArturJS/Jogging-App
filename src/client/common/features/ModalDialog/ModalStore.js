import {observable, action} from 'mobx';

export const MODAL_TYPES = {
	error: 'ERROR_MODE',
	confirm: 'CONFIRM_MODE',
	info: 'INFO_MODE',
	custom: 'CUSTOM_MODE'
};

class ModalStore {
	@observable title;
	@observable body;
	@observable isOpen;
	@observable noClose;
	@observable noCloseOnRedirect;
	@observable modalType;
	@observable modalClassName;
	@observable shouldCloseOnOverlayClick;
	@observable noBackdrop;
	@observable onCloseCallback;
	@observable buttons;

	_modalResult;
	_resolve;

	constructor() {
		this._resetFields();
	}

	_resetFields() {
		this.title = null;
		this.body = null;
		this.isOpen = false;
		this.modalType = null;
		this.modalClassName = null;
		this.onCloseCallback = null;
		this._modalResult = new Promise((res, rej) => {
			this._resolve = res;
		});
		this.noBackdrop = false;
		this.buttons = {
			ok: 'OK',
			cancel: 'Cancel'
		};
	}

	@action
	showError({title, body, className, onCloseCallback}) {
		this._showModal({
			title,
			body,
			modalType: MODAL_TYPES.error,
			className: `modal-info ${className}`,
			noBackdrop: true,
			onCloseCallback
		});

		return this._modalResult;
	}

	@action
	showConfirm({title, body, className, onCloseCallback, buttons = {}}) {
		this._showModal({
			title,
			body,
			modalType: MODAL_TYPES.confirm,
			className: `modal-info ${className}`,
			onCloseCallback,
			buttons: {
				ok: 'OK',
				cancel: 'Cancel',
				...buttons
			}
		});

		return this._modalResult;
	}

	@action
	showInfo({title, body, className, onCloseCallback, buttons = {}}) {
		this._showModal({
			title,
			body,
			modalType: MODAL_TYPES.info,
			className: `modal-info ${className}`,
			onCloseCallback,
			buttons: {
				ok: 'OK',
				cancel: 'Cancel',
				...buttons
			}
		});

		return this._modalResult;
	}

	@action
	showCustom({title = '', component, className = '', noClose = false, noCloseOnRedirect = false, shouldCloseOnOverlayClick = true}) {
		this.noClose = noClose;
		this.noCloseOnRedirect = noCloseOnRedirect;
		this.shouldCloseOnOverlayClick = shouldCloseOnOverlayClick;
		this._showModal({
			title,
			body: component,
			modalType: MODAL_TYPES.custom,
			className: `modal-custom ${className}`
		});

		return this._modalResult;
	}

	@action
	close(result = false) {
		if (!this.noClose) {
			this._resolve(result);
			this._resetFields();
		}
	}

	_showModal({title, body, modalType, className, noBackdrop, onCloseCallback, buttons = {}}) {
		this.isOpen = true;
		this.title = title;
		this.body = body;
		this.modalType = modalType;
		this.noBackdrop = noBackdrop;
		this.modalClassName = className;
		this.onCloseCallback = onCloseCallback;
		this.buttons = {
			ok: 'OK',
			cancel: 'Cancel',
			...buttons
		};
	}
}

export default new ModalStore();
