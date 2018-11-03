// @flow
import type { Element } from 'react';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
    compose,
    pure,
    withHandlers,
    withStateHandlers,
    lifecycle
} from 'recompose';
import { Router } from 'routes';
import modalProvider, {
    MODAL_TYPES,
    CLOSE_DELAY_MS,
    Modal
} from '../modal.provider';
import './modal-dialog.scss';

// eslint-disable-next-line flowtype/no-weak-types
type TRenderFn = (modal: Modal) => Element<any>;

type TClose = (id: number) => void;

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
            setModals: () => (modals: Array<Modal>) => ({ modals })
        }
    ),
    lifecycle({
        componentDidMount() {
            this.unlisten = modalProvider.subscribe(({ modals }) => {
                const {
                    setModals
                }: { setModals: (modals: Array<Modal>) => void } = this.props;

                setModals(modals);
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
            modalProvider.dismissAll();
        }
    }),
    lifecycle({
        componentDidMount() {
            const { dismissAll }: { dismissAll: () => void } = this.props;

            Router.events.on('routeChangeComplete', dismissAll);
        },
        componentWillUnmount() {
            const { dismissAll }: { dismissAll: () => void } = this.props;

            Router.events.off('routeChangeComplete', dismissAll);
        }
    })
);

const enhance = compose(
    withCloseAllOnRouteChange,
    withModalsSubscription,
    withHandlers({
        close: () => (id: number) => {
            modalProvider.close({
                id
            });
        },

        dismiss: () => (id: number) => {
            modalProvider.dismiss({
                id
            });
        },
        renderModalBody: () => (modal: Modal) => (
            <Fragment>
                {typeof modal.body === 'string'
                    ? modal.body
                    : React.cloneElement(modal.body, {
                          // eslint-disable-next-line flowtype/no-weak-types
                          closeModal: (reason?: mixed) => {
                              modalProvider.close({
                                  id: modal.id,
                                  reason
                              });
                          }
                      })}
            </Fragment>
        )
    }),
    withHandlers({
        renderCustomType: ({
            renderModalBody
        }: {
            renderModalBody: TRenderFn
        }) => (modal: Modal) => (
            <div className="modal-custom-body">{renderModalBody(modal)}</div>
        ),
        renderStandardType: ({
            renderModalBody,
            close,
            dismiss
        }: {
            renderModalBody: TRenderFn,
            close: TClose,
            dismiss: TClose
        }) => (modal: Modal) => (
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
}: {
    modals: Array<Modal>,
    dismiss: TClose,
    renderCustomType: TRenderFn,
    renderStandardType: TRenderFn
}) => (
    <Fragment>
        {modals.map(modal => (
            <ReactModal
                key={modal.id}
                isOpen={modal.isOpen}
                onRequestClose={() => dismiss(modal.id)}
                style={
                    modal.noBackdrop ? noBackdropStyle : defaultBackdropStyle
                }
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
                                    <h3 className="modal-title">
                                        {modal.title}
                                    </h3>
                                </div>
                                {modal.type === MODAL_TYPES.custom &&
                                    renderCustomType(modal)}
                                {modal.type !== MODAL_TYPES.custom &&
                                    renderStandardType(modal)}
                            </div>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </ReactModal>
        ))}
    </Fragment>
);

ModalDialog.propTypes = {
    modals: PropTypes.arrayOf(PropTypes.instanceOf(Modal).isRequired)
        .isRequired,
    dismiss: PropTypes.func.isRequired,
    renderCustomType: PropTypes.func.isRequired,
    renderStandardType: PropTypes.func.isRequired
};

export default enhance(ModalDialog);
