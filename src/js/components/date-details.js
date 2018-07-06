import React from 'react';
import moment from 'moment';

import {getOrdinalSuffix} from '../utils/helpers';
import {DATE_FORMAT} from '../utils/constants';

export default class DateDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDay: null,
            currentDayNum: null,
            currentMonth: null
        };
    }

    componentWillMount() {
        this.setCurrentDate();
    }

    componentDidMount() {
        this.clearInterval = setInterval(() => {
            this.setCurrentDate();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clearInterval);
    }

    setCurrentDate() {
        this.setState({
            currentDay: moment().format(DATE_FORMAT.DAY),
            currentDayNum: moment().format(DATE_FORMAT.DAY_NUM),
            currentMonth: moment().format(DATE_FORMAT.MONTH)
        });
    }

    render() {
        return (
            <div className={`rcg-date-details__${this.props.indicator}`}>
                <div className={`rcg-date-details__${this.props.indicator}-header`}>Hello! Today is</div>
                <div className={`rcg-date-details__${this.props.indicator}-body`}>
                    <div className={`rcg-date-details__${this.props.indicator}-week-day`}>
                        {this.state.currentDay}
                        <span>&#44;</span>
                    </div>
                    <div className={`rcg-date-details__${this.props.indicator}-day-month`}>
                        {this.state.currentDayNum}<sup>{getOrdinalSuffix(this.state.currentDayNum)}</sup> {this.state.currentMonth}
                    </div>
                </div>
            </div>
        );
    }
}

DateDetails.defaultProps = {};

DateDetails.propTypes = {
    indicator: React.PropTypes.string
};
