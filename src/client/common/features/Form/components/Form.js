import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
export default class Form extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired,
    onSubmit: PropTypes.func,
    className: PropTypes.string
  };

  static childContextTypes = {
    store: PropTypes.object
  };

  getChildContext() {
    return {
      store: this.props.store
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { store } = this.props;
    if (store) {
      store.submitted = true;
    }
    this.props.onSubmit(e);
  };

  render() {
    const { children, className } = this.props;

    return (
      <form
        onSubmit={this.onSubmit}
        className={className}
        noValidate="noValidate"
      >
        {children}
      </form>
    );
  }
}
