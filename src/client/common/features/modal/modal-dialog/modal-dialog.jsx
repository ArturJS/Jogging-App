import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  compose,
  pure,
  withHandlers,
  withStateHandlers,
  lifecycle
} from 'recompose';
import _ from 'lodash';
import { Router } from 'routes';
import modalProvider, { MODAL_TYPES, CLOSE_DELAY_MS } from '../modal.provider';
import './modal-dialog.scss';

const defaultBackdropStyle = {
  overlay: {
    backgroundColor: ''
  }
};

const noBackdropStyle = {
  overlay: {
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1080
  }
};

const withModalsSubscription = compose(
  withStateHandlers(
    {
      modals: []
    },
    {
      setModals: () => modals => ({ modals })
    }
  ),
  lifecycle({
    componentDidMount() {
      this.unlisten = modalProvider.subscribe(({ modals }) => {
        this.props.setModals(modals);
      });
    },
    componentWillUnmount() {
      this.unlisten();
    }
  })
);

const withCloseAllOnRouteChange = compose(
  withHandlers({
    dismissAll: () => () => {
      modalProvider.closeAll(false);
    }
  }),
  lifecycle({
    componentDidMount() {
      Router.events.on('routeChangeComplete', this.props.dismissAll);
    },
    componentWillUnmount() {
      Router.events.off('routeChangeComplete', this.props.dismissAll);
    }
  })
);

const enhance = compose(
  withCloseAllOnRouteChange,
  withModalsSubscription,
  withHandlers({
    close: () => id => {
      modalProvider.closeModal({
        id,
        reason: true
      });
    },

    dismiss: () => id => {
      modalProvider.closeModal({
        id,
        reason: false
      });
    },
    renderModalBody: () => modal => {
      const isArrayOfStrings = _.isArray(modal.body);

      return (
        <Fragment>
          {isArrayOfStrings
            ? _.map(modal.body, item => <p key={item}>{item}</p>)
            : React.isValidElement(modal.body)
              ? React.cloneElement(modal.body, {
                  closeModal: reason => {
                    modalProvider.closeModal({
                      id: modal.id,
                      reason
                    });
                  }
                })
              : modal.body}
        </Fragment>
      );
    }
  }),
  withHandlers({
    renderCustomType: ({ renderModalBody }) => modal => (
      <div className="modal-custom-body">{renderModalBody(modal)}</div>
    ),
    renderStandardType: ({ renderModalBody, close, dismiss }) => modal => (
      <div>
        <div className="modal-body">{renderModalBody(modal)}</div>
        <div className="modal-footer">
          <button
            className="btn btn-primary btn-ok"
            type="button"
            onClick={() => close(modal.id)}
          >
            Ok
          </button>
          {modal.type === MODAL_TYPES.confirm && (
            <button
              className="btn btn-default btn-cancel"
              type="button"
              onClick={() => dismiss(modal.id)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    )
  }),
  pure
);

const ModalDialog = ({
  modals,
  dismiss,
  renderCustomType,
  renderStandardType
}) => (
  <Fragment>
    {modals.map(modal => (
      <Modal
        key={modal.id}
        isOpen={modal.isOpen}
        onRequestClose={() => dismiss(modal.id)}
        style={modal.noBackdrop ? noBackdropStyle : defaultBackdropStyle}
        className={`modal ${modal.className}`}
        shouldCloseOnOverlayClick={modal.shouldCloseOnOverlayClick}
        closeTimeoutMS={CLOSE_DELAY_MS}
        contentLabel=""
        ariaHideApp={false}
      >
        <TransitionGroup>
          {modal.isOpen && (
            <CSSTransition
              key={modal.id}
              appear
              timeout={CLOSE_DELAY_MS}
              classNames="modal-show"
              mountOnEnter
              unmountOnExit
            >
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  onClick={() => dismiss(modal.id)}
                >
                  &times;
                </button>
                <div className="modal-header">
                  <h3 className="modal-title">{modal.title}</h3>
                </div>
                {modal.type === MODAL_TYPES.custom && renderCustomType(modal)}
                {modal.type !== MODAL_TYPES.custom && renderStandardType(modal)}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </Modal>
    ))}
  </Fragment>
);

ModalDialog.propTypes = {
  modals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.oneOfType([
        PropTypes.element.isRequired,
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
      ]).isRequired,
      type: PropTypes.string.isRequired,
      close: PropTypes.func.isRequired,
      className: PropTypes.string.isRequired,
      shouldCloseOnOverlayClick: PropTypes.bool.isRequired,
      noBackdrop: PropTypes.bool.isRequired
    }).isRequired
  ).isRequired,
  dismiss: PropTypes.func.isRequired,
  renderCustomType: PropTypes.func.isRequired,
  renderStandardType: PropTypes.func.isRequired
};

export default enhance(ModalDialog);
