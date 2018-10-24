import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import _ from 'lodash';
import * as yup from 'yup';
import { Router } from 'routes';
import { withPreloadRoutes } from '../../common/hocs';
import ErrorSummary from '../../common/components/error-summary';
import { Form, Field } from '../../common/features/forms';
import { setIsLoggedIn } from '../../common/graphql/utils';
import './sign-up.scss';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: ''
};

const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $repeatPassword: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      repeatPassword: $repeatPassword
    )
  }
`;

@graphql(SIGN_UP, {
  name: 'signUp',
  options: {
    update: setIsLoggedIn(true)
  }
})
@withPreloadRoutes({
  routes: ['records']
})
export default class SignUp extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired
  };

  state = {
    error: null
  };

  componentWillMount() {
    const nameRgx = /^(\s*[A-Za-z\-\']+)+\s*$/;

    this.validationSchema = yup.object().shape({
      firstName: yup
        .string()
        .matches(nameRgx, 'Please enter first name in the correct format')
        .required('Please enter first name'),
      lastName: yup
        .string()
        .matches(nameRgx, 'Please enter last name in the correct format')
        .required('Please enter last name'),
      email: yup
        .string()
        .email('Please enter email in the correct format')
        .required('Please enter email'),
      password: yup
        .string()
        .min(4, 'Password is too short. Minimal length - 4 characters.')
        .required('Please enter last name'),
      repeatPassword: yup
        .string()
        .oneOf(
          [yup.ref('password'), null],
          'The password and repeat password do not match.'
        )
        .required('Please repeat password')
    });
  }

  onSubmit = async values => {
    try {
      await this.performSignUp(values);

      this.setState({ error: null });
      Router.pushRoute('records');
    } catch (error) {
      this.setState({ error });
    }
  };

  async performSignUp(values) {
    const { firstName, lastName, email, password, repeatPassword } = values;

    const { errors } = await this.props.signUp({
      variables: {
        firstName,
        lastName,
        email,
        password,
        repeatPassword
      },
      errorPolicy: 'all'
    });
    const error = _.get(errors, '[0].message');

    if (error) {
      throw error;
    }
  }

  render() {
    const { error } = this.state;

    return (
      <div className="page sign-up-page">
        <Helmet title="Create an account" />
        <Form
          className="sign-up-form"
          initialValues={defaultValues}
          validationSchema={this.validationSchema}
          onSubmit={this.onSubmit}
        >
          <h2 className="text-center">Create an account</h2>
          <Field name="firstName" component="text" label="First name" />
          <Field name="lastName" component="text" label="Last name" />
          <Field name="email" component="text" label="Email" />
          <Field name="password" component="passwordShow" label="Password" />
          <Field
            name="repeatPassword"
            component="passwordShow"
            label="Repeat password"
          />
          <ErrorSummary error={error} />
          <div className="buttons-group">
            <button type="submit" className="btn btn-primary">
              Create an account
            </button>
          </div>
        </Form>
      </div>
    );
  }
}
