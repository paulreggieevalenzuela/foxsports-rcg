import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import noop from 'lodash/noop';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';

import {getAllJobStatusModifiers} from '../../utils/helpers';
import {DATE_FORMAT, JOB_TYPE, BOOKING_ACTION_TYPE, JOB_STATUS} from '../../utils/constants';

export default class BookingDetailsJob extends React.Component {
    shouldComponentUpdate(newProps) {
        return !isEqual(newProps, this.props);
    }

    renderJobs() {
        const restartJobField = (job) => {
            const {onBookingActionRequest, bookingActionLoadingId, bookingActionResponse} = this.props;
            const showLoadingIcon = bookingActionLoadingId === job.jobId;
            let message = '';

            if (get(bookingActionResponse, 'id', null) === job.jobId) {
                message = get(bookingActionResponse, 'payload.message', '');
            }

            const handleOnClick = () => {
                if (!bookingActionLoadingId) {
                    onBookingActionRequest({jobId: job.jobId, type: BOOKING_ACTION_TYPE.RESTART_JOB});
                }
            };

            const restartButtonClass = classnames(
                'rcg-job__restart-button',
                {'rcg-job__restart-button--disabled': bookingActionLoadingId}
            );

            const restartIconClass = classnames(
                'rcg-job__restart-button-icon',
                'fa',
                {'fa-spinner fa-spin': showLoadingIcon},
                {'fa-refresh': !showLoadingIcon}
            );

            if (job.is_restart_livestream_job || job.is_restart_clip_job) {
                return (
                    <div className="rcg-job__restart-button-block">
                        <button className={restartButtonClass} onClick={handleOnClick}>
                            <i className={restartIconClass} />
                            Restart Job
                        </button>
                        <span className="rcg-job__restart-message">{message}</span>
                    </div>
                );
            }
        };

        const turnOnDataField = (job) => {
            const {onBookingActionRequest, bookingActionLoadingId, bookingActionResponse} = this.props;
            const showLoadingIcon = bookingActionLoadingId === job.jobId;
            let message = '';

            if (get(bookingActionResponse, 'id', null) === job.jobId) {
                message = get(bookingActionResponse, 'payload.message', '');
            }

            const handleOnClick = () => {
                if (!bookingActionLoadingId) {
                    onBookingActionRequest({jobId: job.jobId, type: BOOKING_ACTION_TYPE.TURN_ON_DATA});
                }
            };

            const turnOnButtonClass = classnames(
                'rcg-job__turn-on-data-button',
                {'rcg-job__turn-on-data-button--disabled': bookingActionLoadingId}
            );

            const turnOnButtonIconClass = classnames(
                'rcg-job__turn-on-data-button-icon',
                'fa',
                {'fa-spinner fa-spin': showLoadingIcon},
                {'fa-refresh': !showLoadingIcon}
            );

            if (job.status === JOB_STATUS.SCHEDULED) {
                return (
                    <div>
                        <button className={turnOnButtonClass} onClick={handleOnClick}>
                            <i className={turnOnButtonIconClass} />
                            Turn on Data
                        </button>
                        <span className="rcg-job__turn-on-message">{message}</span>
                    </div>
                );
            }
        };

        const getJobSpecificFields = (job) => {
            const {bookingActionResponse} = this.props;
            let sdnResult, failureReason = null;

            if (get(bookingActionResponse, 'id', null) === job.jobId) {
                sdnResult = get(bookingActionResponse, 'payload.result', null);
            }

            if (job.failureReason) {
                failureReason =  (
                    <div>
                        <dt>
                            Failure Reason
                        </dt>
                        <dd>
                            {(sdnResult) ? sdnResult.failure_reason : job.failureReason}
                        </dd>
                    </div>
                );
            }

            switch (job.description) {
                case JOB_TYPE.ROUTER_SWITCH:
                    return ([
                        <div className="rcg-booking-details-job__info-block" key="2">
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Created
                                </dt>
                                <dd>
                                    {moment(job.createdDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Modified
                                </dt>
                                <dd>
                                    {moment(job.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                {failureReason}
                            </dl>
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Routes
                                </dt>
                                <dd>
                                    {job.routes.replace(/</, '\u2190')}
                                </dd>
                                <dt>
                                    Switch Time
                                </dt>
                                <dd>
                                    {moment(job.switchTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                            </dl>
                        </div>
                    ]);
                case JOB_TYPE.CLIP:
                    return ([
                        <div className="rcg-booking-details-job__info-block" key="2">
                            {restartJobField(job)}
                        </div>,
                        <div className="rcg-booking-details-job__info-block" key="3">
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Created
                                </dt>
                                <dd>
                                    {moment(job.createdDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Modified
                                </dt>
                                <dd>
                                    {moment(job.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                {failureReason}
                            </dl>
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Name
                                </dt>
                                <dd>
                                    {job.name}
                                </dd>
                                <dt>
                                    Clip ID
                                </dt>
                                <dd>
                                    {job.clipId}
                                </dd>
                                <dt>
                                    Recorder
                                </dt>
                                <dd>
                                    {job.recorder}
                                </dd>
                                <dt>
                                    Target
                                </dt>
                                <dd>
                                    {job.target}
                                </dd>
                                <dt>
                                    CC
                                </dt>
                                <dd>
                                    {job.cc}
                                </dd>
                                <dt>
                                    Start Time
                                </dt>
                                <dd>
                                    {moment(job.startTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    End Time
                                </dt>
                                <dd>
                                    {moment(job.endTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Destination
                                </dt>
                                <dd>
                                    {job.destination}
                                </dd>
                            </dl>
                        </div>
                    ]);
                case JOB_TYPE.WO_STATUS_UPDATE:
                    return ([
                        <div className="rcg-booking-details-job__info-block" key="2">
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Created
                                </dt>
                                <dd>
                                    {moment(job.createdDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Modified
                                </dt>
                                <dd>
                                    {moment(job.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                            </dl>
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Booking Status
                                </dt>
                                <dd>
                                    {job.bookingStatus}
                                </dd>
                                <dt>
                                    Booking Message
                                </dt>
                                <dd>
                                    {job.bookingMessage}
                                </dd>
                                {failureReason}
                            </dl>
                        </div>
                    ]);
                case JOB_TYPE.LIVE_STREAM:
                    return ([
                        <div className="rcg-booking-details-job__info-block" key="2">
                            {restartJobField(job)}
                        </div>,
                        <div className="rcg-booking-details-job__info-block" key="3">
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Created
                                </dt>
                                <dd>
                                    {moment(job.createdDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Modified
                                </dt>
                                <dd>
                                    {moment(job.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                {failureReason}
                            </dl>
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Event Name
                                </dt>
                                <dd>
                                    {job.eventName}
                                </dd>
                                <dt>
                                    Event ID
                                </dt>
                                <dd>
                                    {job.eventId}
                                </dd>
                                <dt>
                                    Profile ID
                                </dt>
                                <dd>
                                    {job.profileId}
                                </dd>
                                <dt>
                                    Primary Node
                                </dt>
                                <dd>
                                    {job.primaryNode}
                                </dd>
                                <dt>
                                    Backup Node
                                </dt>
                                <dd>
                                    {job.backupNode}
                                </dd>
                                <dt>
                                    Start Time
                                </dt>
                                <dd>
                                    {moment(job.startTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    End Time
                                </dt>
                                <dd>
                                    {moment(job.endTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Destination
                                </dt>
                                <dd>
                                    {job.destination}
                                </dd>
                            </dl>
                        </div>
                    ]);
                case JOB_TYPE.SDN:
                    return ([
                        <div className="rcg-booking-details-job__info-block" key="2">
                            {turnOnDataField(job)}
                        </div>,
                        <div className="rcg-booking-details-job__info-block" key="3">
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Created
                                </dt>
                                <dd>
                                    {moment((sdnResult) ? sdnResult.creation_date : job.createdDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    Modified
                                </dt>
                                <dd>
                                    {moment((sdnResult) ? sdnResult.modified_date : job.modifiedDate).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                {failureReason}
                            </dl>
                            <dl className="rcg-booking-details-job__info">
                                <dt>
                                    Worklog ID
                                </dt>
                                <dd>
                                    {(sdnResult) ? sdnResult.worklog : job.worklogId}
                                </dd>
                                <dt>
                                    Truck
                                </dt>
                                <dd>
                                    {(sdnResult) ? sdnResult.truck : job.truck}
                                </dd>
                                <dt>
                                    Network
                                </dt>
                                <dd>
                                    {(sdnResult) ? sdnResult.network : job.network}
                                </dd>
                                <dt>
                                    Host Status
                                </dt>
                                <dd>
                                    {(sdnResult) ? sdnResult.hoststatus : job.hostStatus}
                                </dd>
                                <dt>
                                    Start Time
                                </dt>
                                <dd>
                                    {moment((sdnResult) ? sdnResult.start : job.startTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                                <dt>
                                    End Time
                                </dt>
                                <dd>
                                    {moment((sdnResult) ? sdnResult.end : job.endTime).format(DATE_FORMAT.INTERACTIVE)}
                                </dd>
                            </dl>
                        </div>
                    ]);
                default:
                    return null;
            }
        };

        const renderJobStatus = (sdnResult, switchResult, job) => {
            if (sdnResult) {
                return sdnResult.status;
            } else if (switchResult) {
                return switchResult.message;
            } else {
                return job.status;
            }
        };

        const jobs = this.props.info.jobs.map((job, key) => {
            const switchResult = find(this.props.switchResults, {id: job.jobId});
            const status = switchResult ? switchResult.status : job.status;

            const statusBackground = classnames(
                'rcg-booking-details-job__status',
                getAllJobStatusModifiers('rcg-booking-details-job__status', status)
            );

            const jobSpecificFields = getJobSpecificFields(job);
            const {bookingActionResponse} = this.props;
            let sdnResult;

            if (get(bookingActionResponse, 'id', null) === job.jobId) {
                sdnResult = get(bookingActionResponse, 'payload.result', null);
            }

            return (
                <div className="rcg-booking-details-job__item" key={key}>
                    <dl className="rcg-booking-details-job__status-block" key="0">
                        <dt className="rcg-booking-details-job__status-block-number">
                            <span>Job ID</span> {(sdnResult) ? sdnResult.id : job.jobId}
                        </dt>
                        <dd className="rcg-booking-details-job__status-block-info">
                            <span className={statusBackground}>{renderJobStatus(sdnResult, switchResult, job)}</span>
                        </dd>
                    </dl>
                    <div className="rcg-booking-details-job__info-block-main" key="1">
                        <dl className="rcg-booking-details-job__info-main">
                            <dt>
                                Description
                            </dt>
                            <dd className="rcg-booking-details-job__all-caps">
                                {job.description}
                            </dd>
                        </dl>
                        <dl className="rcg-booking-details-job__info-main">
                            <dt>
                                Priority
                            </dt>
                            <dd className="rcg-booking-details-job__all-caps">
                                {(sdnResult) ? sdnResult.priority : job.priority}
                            </dd>
                        </dl>
                    </div>
                    {jobSpecificFields}
                </div>
            );
        });

        return jobs;
    }

    render() {
        return (
            <div className="rcg-booking-details-job">
                {this.renderJobs()}
            </div>
        );
    }
}

BookingDetailsJob.defaultProps = {
    info: {
        jobs: []
    },
    switchResults: [],
    onBookingActionRequest: noop
};

BookingDetailsJob.propTypes = {
    info: React.PropTypes.shape({
        id: React.PropTypes.number,
        workOrderNumber: React.PropTypes.string,
        workOrderSeqNumber: React.PropTypes.string,
        name: React.PropTypes.string,
        type: React.PropTypes.string,
        status: React.PropTypes.string,
        fullPath: React.PropTypes.string,
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
    }),
    switchResults: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number,
        result: React.PropTypes.shape({
            status: React.PropTypes.number,
            message: React.PropTypes.string
        })
    }))
};
