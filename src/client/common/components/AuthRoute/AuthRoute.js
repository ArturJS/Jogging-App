import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import {inject, observer} from 'mobx-react';

@inject('userStore')
@observer
export default class AuthRoute extends Component {
	static propTypes = {
    userStore: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
		path: PropTypes.string.isRequired
	};

	render() {
		const {userStore, component, path} = this.props;
		const {isInitialized, isLoggedIn} = userStore;

		if (!isInitialized) return null;

		if (!isLoggedIn) {
      return <Redirect to={{pathname: '/sign-up', state: {backUrl: path}}}/>;
		}

    return <Route {...this.props} component={component}/>;
	}
}
