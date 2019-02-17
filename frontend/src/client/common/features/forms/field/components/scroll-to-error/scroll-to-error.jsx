import { Component } from 'react';
import PropTypes from 'prop-types';

const getHtmlElementClass = () => {
    if (typeof HTMLElement === 'undefined') {
        return Object;
    }

    // eslint-disable-next-line no-undef
    return HTMLElement;
};

const sleep = timeoutMs =>
    new Promise(resolve => setTimeout(resolve, timeoutMs));

export default class ScrollToError extends Component {
    static propTypes = {
        submitCount: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
        inputRef: PropTypes.shape({
            current: PropTypes.instanceOf(getHtmlElementClass())
        }).isRequired,
        isValid: PropTypes.bool.isRequired
    };

    componentDidUpdate(prevProps) {
        this.focusInputIfInvalid(prevProps);
    }

    focusInputIfInvalid(prevProps) {
        const { submitCount, isValid, errors, name, inputRef } = this.props;
        const isAfterSubmit = prevProps.submitCount !== submitCount;
        const isInvalidForm = !isValid;
        const isInvalidThisInput = Object.keys(errors)[0] === name;

        if (isAfterSubmit && isInvalidForm && isInvalidThisInput) {
            this.scrollToInputAndFocus(inputRef);
        }
    }

    scrollToInputAndFocus(inputRef) {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }

        sleep(500).then(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        });
    }

    render() {
        return null;
    }
}
