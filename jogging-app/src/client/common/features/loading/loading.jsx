import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, setDisplayName, withHandlers } from 'recompose';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Provider, Subscribe } from 'unstated';
import loadingStore from './loading.store';
import './loading.scss';

const enhance = compose(
    pure,
    setDisplayName('Loading'),
    withHandlers({
        // eslint-disable-next-line react/prop-types
        renderLoadingProgress: () => ({ state }) => (
            <TransitionGroup>
                {state.isLoading && (
                    <CSSTransition
                        key="loading"
                        appear
                        timeout={350}
                        classNames="--appear-anim"
                        mountOnEnter
                        unmountOnExit
                    >
                        <div className="loading">
                            <div
                                className="loading__progress"
                                style={{
                                    width: `${state.progress}%`
                                }}
                            />
                        </div>
                    </CSSTransition>
                )}
            </TransitionGroup>
        )
    })
);

const Loading = ({ renderLoadingProgress }) => (
    <Provider>
        <Subscribe to={[loadingStore]}>{renderLoadingProgress}</Subscribe>
    </Provider>
);

Loading.propTypes = {
    renderLoadingProgress: PropTypes.func.isRequired
};

export default enhance(Loading);
