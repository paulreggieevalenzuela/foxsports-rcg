import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import noop from 'lodash/noop';
import filter from 'lodash/filter';
import find from 'lodash/find';

import BookingDetailsJob from './booking-details/job';

import {getAllBookingStatusModifiers} from '../utils/helpers';
import {DATE_FORMAT, BOOKING_ACTION_TYPE, BOOKING_STATUS, SWITCH_RESULT_STATUS} from '../utils/constants';

export default class BookingDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            switchErrorMessage: '',
            switchResults: []
        };
    }

    componentWillReceiveProps(props) {
        const bookingActionResponse = (props.bookingActionResponse) ? props.bookingActionResponse : {};
        const routerSwitchJobs = filter(props.details.jobs, {description: 'Router Switch'});
        let switchResults = [];
        let switchErrorMessage = '';
        let testResults;

        if (bookingActionResponse.id === props.details.id) {
            if (bookingActionResponse.payload.success) {
                testResults = bookingActionResponse.payload.details;

                switchResults = routerSwitchJobs.map(({routes, jobId}) => {
                    const testResult = find(testResults, ({route}) => routes === `${route.destination}<${route.source}`);
                    let status, message;

                    if (!testResult) {
                        status = SWITCH_RESULT_STATUS.SWITCH_IGNORED;
                        message = 'Switch Ignored';
                    } else if (testResult.success) {
                        status = SWITCH_RESULT_STATUS.SWITCH_SUCCESS;
                        message = 'Switch Success';
                    } else {
                        status = SWITCH_RESULT_STATUS.SWITCH_FAILED;
                        message = testResult.details.error;
                    }

                    return {
                        status,
                        message,
                        id: jobId
                    };
                });
            } else {
                switchErrorMessage = `Could not switch visual path: ${bookingActionResponse.payload.message}`;
            }
        }

        this.setState({
            switchErrorMessage,
            switchResults
        });
    }

    renderSwitchVisualPathButton() {
        const showLoadingIcon = this.props.bookingActionLoadingId === this.props.details.id;
        const routerSwitchJobs = filter(this.props.details.jobs, {description: 'Router Switch'});
        const handleClick = () => {
            if (!this.props.bookingActionLoadingId) {
                this.props.onBookingActionRequest({bookingId: this.props.details.id, type: BOOKING_ACTION_TYPE.SWITCH_VISUAL_PATH});
            }
        };

        const switchButtonClass = classnames(
            'rcg-booking-details__switch-button',
            {'rcg-booking-details__switch-button--disabled': this.props.bookingActionLoadingId}
        );

        const switchIconClass = classnames(
            'rcg-booking-details__switch-button-icon',
            'fa',
            {'fa-spinner fa-spin': showLoadingIcon},
            {'fa-exchange': !showLoadingIcon}
        );

        if (
            this.props.details.status === BOOKING_STATUS.SCHEDULED &&
            this.props.details.fullPathSwitching &&
            routerSwitchJobs.length > 0
        ) {
            return [
                <button key="1" className={switchButtonClass} onClick={handleClick}>
                    <i className={switchIconClass} />
                    Switch Visual Path
                </button>,
                <span key="2" className="rcg-booking-details__switch-error-message">{this.state.switchErrorMessage}</span>
            ];
        }
    }

    render() {
        const statusBackground = classnames(
            'rcg-booking-details__status',
            getAllBookingStatusModifiers('rcg-booking-details__status', this.props.details.status)
        );

        const indicator = classnames(
            'rcg-booking-details__indicator',
            {'rcg-booking-details__indicator--show': this.props.fullView}
        );

        return (
            <div className="rcg-booking-details">
                <div className={indicator}>
                    Search WO# Result:
                </div>
                <div className="rcg-booking-details-container">
                    <dl className="rcg-booking-details__status-block">
                        <dt className="rcg-booking-details__status-block-number">
                            <span>WO#</span> {this.props.details.workOrderNumber}
                        </dt>
                        <dd className="rcg-booking-details__status-block-info">
                            <span className={statusBackground}>{this.props.details.status}</span>
                        </dd>
                    </dl>
                    <h3 className="rcg-booking-details__info-title">
                        {this.props.details.name}
                    </h3>
                    <div className="rcg-booking-details__info-block">
                        <dl className="rcg-booking-details__info rcg-booking-details__info--left-column">
                            <dt>
                                Booking ID
                            </dt>
                            <dd>
                                {this.props.details.id}
                            </dd>
                            <dt>
                                WO Seq. #
                            </dt>
                            <dd>
                                {this.props.details.workOrderSeqNumber}
                            </dd>
                            <dt>
                                Type
                            </dt>
                            <dd className="rcg-booking-details__all-caps">
                                {this.props.details.type}
                            </dd>
                            <dt>
                                Full Path
                            </dt>
                            <dd className="rcg-booking-details__all-caps">
                                {this.props.details.fullPath}
                            </dd>
                        </dl>
                        <dl className="rcg-booking-details__info rcg-booking-details__info--right-column">
                            <dt>
                                Created
                            </dt>
                            <dd>
                                {moment(this.props.details.creationDate).format(DATE_FORMAT.INTERACTIVE)}
                            </dd>
                            <dt>
                                Modified
                            </dt>
                            <dd>
                                {moment(this.props.details.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                            </dd>
                            <dt>
                                Start Time
                            </dt>
                            <dd>
                                {moment(this.props.details.startDateTime).format(DATE_FORMAT.INTERACTIVE)}
                            </dd>
                            <dt>
                                End Time
                            </dt>
                            <dd>
                                {moment(this.props.details.endDateTime).format(DATE_FORMAT.INTERACTIVE)}
                            </dd>
                        </dl>
                    </div>
                    <div className="rcg-booking-details__filter-button">
                        {this.renderSwitchVisualPathButton()}
                    </div>
                    <BookingDetailsJob
                        info={this.props.details}
                        onBookingActionRequest={this.props.onBookingActionRequest}
                        bookingActionLoadingId={this.props.bookingActionLoadingId}
                        bookingActionResponse={this.props.bookingActionResponse}
                        switchResults={this.state.switchResults} />
                </div>
            </div>
        );
    }
}

BookingDetails.defaultProps = {
    onHideDetails: noop,
    onBookingActionRequest: noop,
    details: {
        status: ''
    }
};

BookingDetails.propTypes = {
    fullView: React.PropTypes.bool,
    details: React.PropTypes.shape({
        id: React.PropTypes.number,
        workOrderNumber: React.PropTypes.string,
        workOrderSeqNumber: React.PropTypes.string,
        name: React.PropTypes.string,
        type: React.PropTypes.string,
        status: React.PropTypes.string,
        fullPath: React.PropTypes.string,
        fullPathSwitching: React.PropTypes.bool,
        creationDate: React.PropTypes.string,
        modifiedDate: React.PropTypes.string,
        startDateTime: React.PropTypes.string,
        endDateTime: React.PropTypes.string,
        send_to_evs: React.PropTypes.bool,
        send_to_ardome: React.PropTypes.bool,
        send_to_avid: React.PropTypes.bool,
        jobs: React.PropTypes.arrayOf(React.PropTypes.shape({
            description: React.PropTypes.string,
            jobId: React.PropTypes.number,
            modifiedDate: React.PropTypes.string,
            priority: React.PropTypes.string,
            status: React.PropTypes.string,
            createdDate: React.PropTypes.string,
            startTime: React.PropTypes.string,
            endTime: React.PropTypes.string,
            failureReason: React.PropTypes.string,
            // clip and livestream
            name: React.PropTypes.string,
            destination: React.PropTypes.string,
            // router switch
            routes: React.PropTypes.string,
            switchTime: React.PropTypes.string,
            // clip
            clipId: React.PropTypes.string,
            recorder: React.PropTypes.string,
            target: React.PropTypes.string,
            cc: React.PropTypes.string,
            is_restart_clip_job: React.PropTypes.string.bool,
            // WO status update
            bookingStatus: React.PropTypes.string,
            bookingMessage: React.PropTypes.string,
            // live stream
            eventId: React.PropTypes.string,
            profileId: React.PropTypes.string,
            backupNode: React.PropTypes.string,
            primaryNode: React.PropTypes.string,
            is_restart_livestream_job: React.PropTypes.bool,
            // SDN
            worklogId: React.PropTypes.string,
            truck: React.PropTypes.string,
            network: React.PropTypes.string,
            hostStatus: React.PropTypes.string,
            is_allow_test_network: React.PropTypes.string.bool
        }))
    }),
    onBookingActionRequest: React.PropTypes.func,
    bookingActionLoadingId: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    bookingActionResponse: React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        payload: React.PropTypes.shape({
            status: React.PropTypes.number,
            message: React.PropTypes.string
        })
    })
};
