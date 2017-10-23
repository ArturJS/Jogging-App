import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Modal from 'react-modal';
import _ from 'lodash';

import {MODAL_TYPES} from './ModalStore';
import './ModalDialog.scss';


@inject('modalStore')
@observer
export default class ModalDialog extends Component {
  static propTypes = {
    modalStore: PropTypes.object.isRequired
  };

  static noBackdropStyle = {
    overlay: {
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      zIndex: 1080
    }
  };

  close = () => {
    if (this.props.modalStore.onCloseCallback) {
      this.props.modalStore.onCloseCallback();
    }
    this.props.modalStore.close(true);
  };

  dismiss = () => {
    if (!this.props.modalStore.noClose) {
      this.props.modalStore.close(false);
    }
  };

  render() {
    const {
      isOpen,
      noBackdrop,
      modalType,
      modalClassName,
      shouldCloseOnOverlayClick,
      title,
      body,
      buttons
    } = this.props.modalStore;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.dismiss}
        style={noBackdrop ? ModalDialog.noBackdropStyle : {}}
        className={`modal ${modalClassName}`}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        contentLabel={''}>
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              onClick={this.dismiss}>
              &times;
            </button>
            <div className="modal-header">
              <h3 className="modal-title">
                {title}
              </h3>
            </div>
            {modalType === MODAL_TYPES.custom &&
            <div className="modal-custom-body">
              {body && body.length && typeof body !== 'string' ?
                _.map(body, item => <p key={item}>{item}</p>) : body
              }
            </div>
            }
            {modalType !== MODAL_TYPES.custom &&
            <div>
              <div className="modal-body">
                {!React.isValidElement(body) &&
                body && body.length && typeof body !== 'string' ?
                  _.map(body, item => <p key={item}>{item}</p>) : body
                }
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.close}>
                  {buttons.ok}
                </button>
                {modalType === MODAL_TYPES.confirm &&
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={this.dismiss}>
                  {buttons.cancel}
                </button>
                }
              </div>
            </div>
            }
          </div>
        </div>
      </Modal>
    );
  }
}
