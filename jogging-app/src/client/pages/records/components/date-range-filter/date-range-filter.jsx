import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from 'react-dates/lib/components/DateRangePicker';
import './date-range-filter.scss';

export default class DateRangeFilter extends Component {
    static propTypes = {
        onDatesChange: PropTypes.func.isRequired
    };

    state = {
        focusedInput: null,
        startDate: null,
        endDate: null
    };

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({
            startDate,
            endDate
        });

        const { onDatesChange } = this.props;

        onDatesChange({ startDate, endDate });
    };

    onFocusChange = focusedInput => {
        this.setState({ focusedInput });
    };

    enableAnyDates = () => false;

    render() {
        const { focusedInput, startDate, endDate } = this.state;

        return (
            <div className="date-range-filter">
                <div className="date-range-filter-title">
                    Filter by date range:
                </div>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDatesChange={this.onDatesChange}
                    focusedInput={focusedInput}
                    onFocusChange={this.onFocusChange}
                    isOutsideRange={this.enableAnyDates}
                    displayFormat="DD.MM.YYYY"
                    showClearDates
                />
            </div>
        );
    }
}
