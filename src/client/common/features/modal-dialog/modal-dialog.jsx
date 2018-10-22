import React, { Component } from 'react';
import { Router } from 'routes';
import Modal from 'react-modal';
import _ from 'lodash';
import modalManager, { MODAL_TYPES } from './modal-manager';
import './modal-dialog.scss';

const noBackdropStyle = {
  overlay: {
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1080
  }
};

export default class ModalDialog extends Component {
  state = {
    isOpen: false
  };

  componentDidMount() {
    this.unlisten = [
      this.handleLocationChange,
      modalManager.pubsub.on('toggleModal', isOpen => {
        this.setState({
          isOpen
        });
      })
    ];
  }

  componentWillUnmount() {
    this.unlisten.forEach(cb => cb());
  }

  handleLocationChange = () => {
    Router.events.on('routeChangeComplete', this.dismiss);

    return () => {
      Router.events.off('routeChangeComplete', this.dismiss);
    };
  };

  close = () => {
    modalManager.close(true);
  };

  dismiss = () => {
    modalManager.close(false);
  };

  render() {
    const { isOpen } = this.state;
    const {
      noBackdrop,
      modalType,
      modalClassName,
      title,
      body,
      buttons
    } = modalManager;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.dismiss}
        style={noBackdrop ? noBackdropStyle : {}}
        className={`modal ${modalClassName}`}
        shouldCloseOnOverlayClick={true}
        contentLabel={''}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button type="button" className="close" onClick={this.dismiss}>
              &times;
            </button>
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
            </div>
            {modalType === MODAL_TYPES.custom && (
              <div className="modal-custom-body">
                {body && body.length && typeof body !== 'string'
                  ? _.map(body, item => <p key={item}>{item}</p>)
                  : body}
              </div>
            )}
            {modalType !== MODAL_TYPES.custom && (
              <div>
                <div className="modal-body">
                  {!React.isValidElement(body) &&
                  body &&
                  body.length &&
                  typeof body !== 'string'
                    ? _.map(body, item => <p key={item}>{item}</p>)
                    : body}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={this.close}
                  >
                    {buttons.ok}
                  </button>
                  {modalType === MODAL_TYPES.confirm && (
                    <button
                      className="btn btn-default"
                      type="button"
                      onClick={this.dismiss}
                    >
                      {buttons.cancel}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
