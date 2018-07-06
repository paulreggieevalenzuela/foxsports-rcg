import React from 'react';
import noop from 'lodash/noop';
import moment from 'moment';

import DatePicker from '../date-picker';
import Clock from '../clock';
import DateDetails from '../date-details';
import DropdownList from '../dropdown-list';

import {DASHBOARD_TYPE, BOOKING_STATUS, DATE_PERIOD, FILTER_TYPE, DATE_FORMAT} from '../../utils/constants';

export default class InteractiveSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedStatus: BOOKING_STATUS.ALL,
            selectedDatePeriod: DATE_PERIOD.TODAY,
            dateRange: false
        };
    }

    handleStatusDropdown(e) {
        const status = (e.target.value === BOOKING_STATUS.ALL) ? null : e.target.value;

        this.setState({selectedStatus: e.target.value});
        this.props.onFilterUpdate(FILTER_TYPE.STATUS, status);
        this.props.handleHideIndicator();
    }

    handleDateFilterChange(e) {
        const filterByDate = (range) => this.props.onFilterUpdate(FILTER_TYPE.DATE, range);
        const periodCovered = e.target.value;
        const dateTomorrow = moment().add(1, 'day')
            .format(DATE_FORMAT.DATE);

        this.setState({selectedDatePeriod: periodCovered, dateRange: false});
        this.props.handleHideIndicator();

        switch (periodCovered) {
            case DATE_PERIOD.TODAY:
                filterByDate({
                    from: moment().format(DATE_FORMAT.DATE),
                    to: dateTomorrow
                });
                break;
            case DATE_PERIOD.LAST_WEEK:
                filterByDate({
                    from: moment().subtract(1, 'week')
                        .format(DATE_FORMAT.DATE),
                    to: dateTomorrow
                });
                break;
            case DATE_PERIOD.LAST_MONTH:
                filterByDate({
                    from: moment().subtract(1, 'month')
                        .format(DATE_FORMAT.DATE),
                    to: dateTomorrow
                });
                break;
            case DATE_PERIOD.CUSTOM_RANGE:
                this.setState({dateRange: true});
                break;
            default:
                break;
        }
    }

    handleResetFilter() {
        this.setState({
            selectedStatus: BOOKING_STATUS.ALL,
            selectedDatePeriod: DATE_PERIOD.TODAY,
            dateRange: false
        });
        this.props.onResetFilter();
    }

    render() {
        return (
            <aside className="rcg-interactive-sidebar">
                <DateDetails indicator={DASHBOARD_TYPE.INTERACTIVE} />
                <Clock timezone="Australia/Sydney" label="SYD" subLabel="LOC TIME" indicator={DASHBOARD_TYPE.INTERACTIVE} />
                <Clock timezone="UTC" label="UTC" subLabel="STD TIME" indicator={DASHBOARD_TYPE.INTERACTIVE} />

                <div className="rcg-interactive-sidebar__filter">
                    <hr className="rcg-interactive-sidebar__hr" />
                    <h2>Filters</h2>
                    <hr className="rcg-interactive-sidebar__hr" />
                    <DatePicker
                        selected={this.state.selectedDatePeriod}
                        handleDateFilterChange={this.handleDateFilterChange.bind(this)}
                        dateRange={this.state.dateRange}
                        onFilterUpdate={this.props.onFilterUpdate}
                        onHideIndicator={this.props.handleHideIndicator} />
                    <div className="rcg-interactive-sidebar__filter-status">
                        <fieldset className="rcg-interactive-sidebar__filter-status-select">
                            <label className="rcg-interactive-sidebar__filter-label">Select Status</label>
                            <div className="rcg-interactive-sidebar__filter-drop">
                                <DropdownList
                                    options={BOOKING_STATUS}
                                    selected={this.state.selectedStatus}
                                    classNames="rcg-interactive-sidebar__filter-status-options"
                                    onChangeValue={this.handleStatusDropdown.bind(this)} />
                            </div>
                        </fieldset>
                    </div>
                    <div className="rcg-interactive-sidebar__filter-button">
                        <button
                            className="rcg-interactive-sidebar__filter-reset-button"
                            onClick={this.handleResetFilter.bind(this)}>
                            RESET
                        </button>
                    </div>
                </div>
            </aside>
        );
    }
}

InteractiveSidebar.defaultProps = {
    renderOptions: noop
};

InteractiveSidebar.propTypes = {
    onFilterUpdate: React.PropTypes.func,
    handleHideIndicator: React.PropTypes.func,
    onResetFilter: React.PropTypes.func
};
