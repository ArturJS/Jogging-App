import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const getHtmlElementClass = () => {
    if (typeof HTMLElement === 'undefined') {
        return Object;
    }

    return HTMLElement;
};

const sleep = timeoutMs =>
    new Promise(resolve => setTimeout(resolve, timeoutMs));

export default class ScrollToError extends Component {
    static propTypes = {
        submitCount: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        inputRef: PropTypes.shape({
            current: PropTypes.instanceOf(getHtmlElementClass())
        }).isRequired,
        isValid: PropTypes.bool.isRequired
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.submitCount !== this.props.submitCount &&
            !this.props.isValid
        ) {
            if (Object.keys(this.props.errors)[0] === this.props.name) {
                ReactDOM.findDOMNode(
                    this.props.inputRef.current
                ).scrollIntoView({
                    behavior: 'smooth'
                });

                sleep(500).then(() => {
                    this.props.inputRef.current.focus();
                });
            }
        }
    }

    render() {
        return null;
    }
}
