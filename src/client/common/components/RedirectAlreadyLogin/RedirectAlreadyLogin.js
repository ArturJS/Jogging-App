import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import {inject, observer} from 'mobx-react';

@withRouter
@inject('userStore')
@observer
export default class RedirectAlreadyLogin extends Component {
	static propTypes = {
		userStore: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
	};

	render() {
		const {userStore, component, location} = this.props;
		const {isLoggedIn, isInitialized} = userStore;
		const {state} = location;

		if (!isInitialized) return null;

		if (isLoggedIn) {
			if (state && state.backUrl) {
				return <Redirect to={state.backUrl}/>;
			}
			return <Redirect to={'/records'}/>;
		}

		return <Route {...this.props} component={component}/>;
	}
}
