import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { graphql, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import { Router } from 'routes';
import _ from 'lodash';
import { IS_LOGGED_IN } from '../../graphql/queries';
import { setIsLoggedIn } from '../../graphql/utils';
import { Form, Field } from '../../features/forms';
import './header.scss';

const defaultValues = {
    authEmail: '',
    authPassword: ''
};

@graphql(
    gql`
        mutation {
            signOut
        }
    `,
    {
        name: 'signOut',
        options: {
            update: setIsLoggedIn(false)
        }
    }
)
@graphql(
    gql`
        mutation($email: String!, $password: String!) {
            signIn(email: $email, password: $password)
        }
    `,
    {
        name: 'signIn',
        options: {
            update: setIsLoggedIn(true)
        }
    }
)
class Header extends Component {
    static propTypes = {
        signIn: PropTypes.func.isRequired,
        signOut: PropTypes.func.isRequired
    };

    state = {
        error: null
    };

    componentWillMount() {
        this.validationSchema = yup.object().shape({
            authEmail: yup.string().required('Please enter email'),
            authPassword: yup.string().required('Please enter password')
        });
    }

    onSubmit = async (values, { resetForm }) => {
        try {
            await this.performSignIn(values);

            resetForm();
            this.setState({ error: null });
            Router.pushRoute('records');
        } catch (error) {
            this.setState({ error });
        }
    };

    onSignOut = async () => {
        const { signOut } = this.props;

        await signOut();
        Router.pushRoute('sign-up');
    };

    performSignIn = async ({ authEmail, authPassword }) => {
        const { signIn } = this.props;
        const { errors } = await signIn({
            variables: {
                email: authEmail,
                password: authPassword
            },
            errorPolicy: 'all'
        });
        const error = _.get(errors, '[0].message');

        if (error) {
            throw error;
        }
    };

    renderLogout() {
        return (
            <button
                type="button"
                className="btn btn-default"
                onClick={this.onSignOut}
            >
                Logout
            </button>
        );
    }

    renderLogin() {
        const { error } = this.state;

        return (
            <Form
                className="login-form"
                initialValues={defaultValues}
                validationSchema={this.validationSchema}
                onSubmit={this.onSubmit}
            >
                <Field name="authEmail" component="text" placeholder="Email" />
                <Field
                    name="authPassword"
                    component="password"
                    placeholder="Password"
                />
                {error && <div className="login-error-summary">{error}</div>}
                <button type="submit" className="btn btn-default btn-submit">
                    Log In
                </button>
            </Form>
        );
    }

    render() {
        return (
            <Query query={IS_LOGGED_IN} fetchPolicy="cache-and-network">
                {({
                    data: {
                        authState: { isLoggedIn }
                    }
                }) => (
                    <div
                        className={classNames('header', {
                            'is-logged-in': isLoggedIn
                        })}
                    >
                        <div className="header-brand">Jogging App</div>
                        <div className="header-auth">
                            {isLoggedIn
                                ? this.renderLogout()
                                : this.renderLogin()}
                        </div>
                    </div>
                )}
            </Query>
        );
    }
}

export default Header;
