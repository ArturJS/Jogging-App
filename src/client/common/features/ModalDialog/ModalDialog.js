import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router';
import Modal from 'react-modal';
import _ from 'lodash';
import modalManager, { MODAL_TYPES } from './ModalManager';
import './ModalDialog.scss';

const noBackdropStyle = {
  overlay: {
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1080
  }
};

// @withRouter
export default class ModalDialog extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    isOpen: false
  };

  // componentDidMount() { // todo fix
  //   this.unlisten = [
  //     this.props.history.listen(this.onLocationChange),
  //     modalManager.pubsub.on('toggleModal', isOpen => {
  //       this.setState({
  //         isOpen
  //       });
  //     })
  //   ];
  // }

  // componentWillUnmount() {
  //   this.unlisten.forEach(cb => cb());
  // }

  onLocationChange = () => {
    modalManager.close(false);
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
