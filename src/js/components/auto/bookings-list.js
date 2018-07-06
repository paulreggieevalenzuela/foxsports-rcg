import React from 'react';
import kebabCase from 'lodash/kebabCase';
import {displayDateFormat} from '@fsa/fs-commons/lib/utils/date';
import classnames from 'classnames';

export default class AutoBookingsList extends React.PureComponent {
    render() {
        const className = classnames(
            'rcg-auto-bookings-list',
            {[`rcg-auto-bookings-list--${kebabCase(this.props.status)}`]: this.props.status}
        );

        return (
            <ul className={className}>
                <li className="rcg-auto-bookings-list__tracker">
                    <div className="rcg-auto-bookings-list__tracker-item">-</div>
                </li>
                <li className="rcg-auto-bookings-list__time">
                    <div className="rcg-auto-bookings-list__time-container">
                        <div className="rcg-auto-bookings-list__time-start">
                            {displayDateFormat(this.props.startDateTime, 'HH:mm')}
                        </div>
                        <hr />
                        <div className="rcg-auto-bookings-list__time-end">
                            {displayDateFormat(this.props.endDateTime, 'HH:mm')}
                        </div>
                    </div>
                </li>
                <li className="rcg-auto-bookings-list__working-order">{this.props.workOrderNumber}</li>
                <li className="rcg-auto-bookings-list__sport">{this.props.sport} - {this.props.name.split('_').join(' ')}</li>
                <li className="rcg-auto-bookings-list__signal-path">Signal Path {this.props.signalPath}</li>
                <li className="rcg-auto-bookings-list__comms">{this.props.comms}</li>
                <li className="rcg-auto-bookings-list__return-path">Return Path {this.props.returnPath}</li>
                <li className="rcg-auto-bookings-list__splits">splits {this.props.splits}</li>
            </ul>
        );
    }
}

AutoBookingsList.defaultProps = {
    name: '',
    returnPath: [],
    signalPath: [],
    splits: []
};

AutoBookingsList.propTypes = {
    comms: React.PropTypes.string,
    name: React.PropTypes.string,
    returnPath: React.PropTypes.arrayOf(React.PropTypes.string),
    signalPath: React.PropTypes.arrayOf(React.PropTypes.string),
    splits: React.PropTypes.arrayOf(React.PropTypes.string),
    sport: React.PropTypes.string,
    status: React.PropTypes.string,
    startDateTime: React.PropTypes.string,
    endDateTime: React.PropTypes.string,
    workOrderNumber: React.PropTypes.string
};
