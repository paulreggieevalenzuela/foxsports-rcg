import React from 'react';
import DayPicker from 'react-datepicker';
import moment from 'moment';
import noop from 'lodash/noop';

import DropdownList from './dropdown-list';

import {FILTER_TYPE, DATE_FORMAT, DATE_PERIOD} from '../utils/constants';

export default class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            selected: props.selected,
            dateRange: props.dateRange
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected,
            dateRange: nextProps.dateRange
        });
    }

    filterByDate(range) {
        return this.props.onFilterUpdate(FILTER_TYPE.DATE, range);
    }

    handleDateChange({startDate, endDate}) {
        let start = startDate || this.state.startDate;
        let end = endDate || this.state.endDate;

        if (start.isAfter(end)) {
            end = start;
        }

        this.setState({startDate: start, endDate: end});

        this.filterByDate({
            from: moment(start).format(DATE_FORMAT.DATE),
            to: moment(end).add(1, 'day')
                .format(DATE_FORMAT.DATE)
        });
    }

    render() {
        let datePicker = null;

        if (this.state.dateRange) {
            datePicker = (
                <div className="rcg-date-picker__date-picker">
                    <label className="rcg-date-picker__label">Select Range: </label>
                    <div className="rcg-date-picker__day-picker">
                        <label className="rcg-date-picker__day-picker-label">From:</label>
                        <div className="rcg-date-picker__drop">
                            <DayPicker
                                dateFormat="MM/DD"
                                selected={this.state.startDate}
                                selectsStart={true}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(startDate) => this.handleDateChange({startDate}).bind(this)}
                                className="rcg-date-picker__date-picker-input" />
                        </div>
                    </div>
                    <div className="rcg-date-picker__day-picker">
                        <label className="rcg-date-picker__day-picker-label">To:</label>
                        <div className="rcg-date-picker__drop">
                            <DayPicker
                                dateFormat="MM/DD"
                                selected={this.state.endDate}
                                selectsEnd={true}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(endDate) => this.handleDateChange({endDate}).bind(this)}
                                className="rcg-date-picker__date-picker-input" />
                        </div>
                    </div>
                    <hr className="rcg-interactive-sidebar__hr-filter" />
                </div>
            );
        }

        return (
            <div className="rcg-date-picker__filter-period">
                <fieldset className="rcg-date-picker__filter-period-select">
                    <label className="rcg-date-picker__label">Period Covered:</label>
                    <div className="rcg-date-picker__drop">
                        <DropdownList
                            options={DATE_PERIOD}
                            selected={this.state.selected}
                            classNames="rcg-date-picker__period-options"
                            onChangeValue={this.props.handleDateFilterChange} />
                    </div>
                </fieldset>
                {datePicker}
            </div>
        );
    }
}

DatePicker.defaultProps = {
    onFilterUpdate: noop
};

DatePicker.propTypes = {
    onFilterUpdate: React.PropTypes.func,
    handleDateFilterChange: React.PropTypes.func,
    selected: React.PropTypes.string,
    dateRange: React.PropTypes.bool
};
