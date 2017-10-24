import React, {Component} from 'react';
import _ from 'lodash';

export default function processErrors(WrappedComponent) {
  return class extends Component {
    state = {
      error: null
    };

    setError = (error) => {
      this.setState({error});
    };

    processAjaxError = (error) => {
      const errorStatus = _.get(error, 'response.status');

      if (errorStatus === 400) {
        this.setState({
          error: error.response.data.error
        });
      }
    };

    render() {
      return (
        <WrappedComponent
          error={this.state.error}
          setErrors={this.setError}
          processAjaxError={this.processAjaxError}
          {...this.props}/>
      );
    }
  };
}
