import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from '../../components/header';
import NavSubHeader from '../../components/nav-sub-header';
import { ModalDialog } from '../../features/modal';
import '../../styles/base.scss';
import './root-shell.scss';

const APP_NAME = 'Jogging App';
const head = {
    titleTemplate: `${APP_NAME}: %s`,
    meta: [
        {
            name: 'description',
            content: 'All the modern best practices in one example.'
        },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: APP_NAME },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: APP_NAME },
        {
            property: 'og:description',
            content: 'All the modern best practices in one example.'
        },
        { property: 'og:card', content: 'summary' },
        {
            property: 'og:image',
            content: 'https://react-redux.herokuapp.com/logo.jpg'
        },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' }
    ]
};

export default class RootShell extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired
    };

    render() {
        const { children } = this.props;

        return (
            <div className="root-shell">
                <Helmet {...head} />
                <Header />
                <NavSubHeader />
                <div className="page-container">{children}</div>
                <ModalDialog />
            </div>
        );
    }
}
