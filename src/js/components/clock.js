import React from 'react';
import moment from 'moment';

import {DATE_FORMAT} from '../utils/constants';

export default class Clock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTime: null
        };
    }

    componentWillMount() {
        this.setCurrentTime();
    }

    componentDidMount() {
        this.clearInterval = setInterval(() => {
            this.setCurrentTime();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clearInterval);
    }

    setCurrentTime() {
        let currentTime;
        const {timezone} = this.props;

        if (timezone === 'UTC') {
            currentTime = moment().utc();
        } else {
            currentTime = moment().tz(timezone);
        }

        this.setState({
            currentTime
        });
    }

    render() {
        return (
            <div className={`rcg-clock__${this.props.indicator}`}>
                <div className={`rcg-clock__${this.props.indicator}-header`}>
                    <span className={`rcg-clock__${this.props.indicator}-header-label`}>{this.props.label}</span>
                    <span
                        className={`rcg-clock__${this.props.indicator}-header-sublabel`}>
                        {this.props.subLabel}</span>
                </div>
                <div className={`rcg-clock__${this.props.indicator}-body`}>
                    <time>
                        {this.state.currentTime.format(DATE_FORMAT.TIME)}
                    </time>
                </div>
            </div>
        );
    }
}

Clock.defaultProps = {};

Clock.propTypes = {
    timezone: React.PropTypes.string,
    label: React.PropTypes.string,
    subLabel: React.PropTypes.string,
    indicator: React.PropTypes.string
};
