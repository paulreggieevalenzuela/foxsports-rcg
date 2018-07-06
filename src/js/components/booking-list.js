import React from 'react';
import classnames from 'classnames';
import noop from 'lodash/noop';
import camelCase from 'lodash/camelCase';
import moment from 'moment';

import BookingDetails from './booking-details';
import ResultLoader from './result-loader';

import {getAllBookingStatusModifiers, sortBy} from '../utils/helpers';
import {DATE_FORMAT, SORT_ORDER, SORT_OPTIONS} from '../utils/constants';

const firstBy = require('thenby');

export default class BookingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {},
            currentlySelectedColumn: null,
            bookings: props.bookings,
            sortOption: SORT_OPTIONS.WO_NUMBER,
            sortOrder: SORT_ORDER.ASC
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookings: nextProps.bookings
        });
    }

    renderBookings() {
        const {bookings} = this.state;
        const booking = bookings.map((booking, index) => {
            // 'fa' && 'fa-clock-o' is from font-awesome library or temporary use for icons
            const onClickHandler = () => this.props.onBookingItemClick(booking);
            const icon = classnames(
                'rcg-booking-list__icon fa',
                getAllBookingStatusModifiers('rcg-booking-list__icon', booking.status)
            );

            /* eslint-disable jsx-a11y/click-events-have-key-events,  jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role */
            return (
                <li className="rcg-booking-list__list-item" tabIndex={index} key={index} onClick={onClickHandler}>
                    <div className="rcg-booking-list__item-status">
                        <i className={icon} aria-hidden="true" />
                    </div>
                    <div className="rcg-booking-list__item-info">
                        <div className="rcg-booking-list__item-info-detail">
                            <span>WO# {booking.workOrderNumber}</span>
                            <span>Path: {booking.fullPath}</span>
                            <span>Type: {booking.type}</span>
                        </div>
                        <div className="rcg-booking-list__item-info-title">
                            {booking.name}
                        </div>
                        <div className="rcg-booking-list__item-info-detail">
                            Start Time: {moment(booking.startDateTime).format(DATE_FORMAT.INTERACTIVE)}
                        </div>
                        <div className="rcg-booking-list__item-info-detail">
                            End Time: {moment(booking.endDateTime).format(DATE_FORMAT.INTERACTIVE)}
                        </div>
                    </div>
                </li>
            );

            /* eslint-enable jsx-a11y/click-events-have-key-events,  jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role */
        });

        return booking;
    }

    renderSortOption() {
        const option = Object.keys(SORT_OPTIONS).map((key, index) => {
            return (<option key={index} value={SORT_OPTIONS[key]}>{SORT_OPTIONS[key]}</option>);
        });

        return option;
    }

    handleColumnSort(column, order) {
        const sortedBookings = this.state.bookings.sort(
            firstBy((a, b) => sortBy(camelCase(column), order, a, b))
                .thenBy((a, b) => sortBy('startDateTime', order, a, b))
                .thenBy((a, b) => sortBy('endDateTime', order, a, b))
                .thenBy((a, b) => sortBy('workOrderNumber', order, a, b))
        );

        this.setState({
            bookings: sortedBookings,
            currentlySelectedColumn: column
        });
    }

    handleSortOrder(e) { // this will handle the value of the radio button e.g Asc || Desc
        this.setState({sortOrder: e.target.value});
        this.handleColumnSort(this.state.sortOption, e.target.value);
    }

    handleSortOptionChange(e) { // this will handle the select option
        this.setState({sortOption: e.target.value});
        this.handleColumnSort(e.target.value, this.state.sortOrder);
    }

    render() {
        const toogleBookingList = classnames(
            'rcg-booking-list__content',
            {'rcg-booking-list__content--hide': this.props.fullView}
        );
        let loadBookings = (
            <ul className="rcg-booking-list__list">
                {(this.state.bookings.length === 0) ? <ResultLoader message="No Records Found" /> : this.renderBookings()}
            </ul>
        );

        if (this.props.isLoading) {
            loadBookings = <ResultLoader message="Loading data, please wait..." spinner={true} />;
        }

        return (
            <section className="rcg-booking-list">
                <div className={toogleBookingList}>
                    <div className="rcg-booking-list__indicator">
                        Filter Results:
                    </div>
                    <div className="rcg-booking-list__sort">
                        <fieldset className="rcg-booking-list__sort-select-cat">
                            <label className="rcg-booking-list__sort-label">Sort by</label>
                            <div className="rcg-booking-list__sort-drop">
                                <select
                                    className="rcg-booking-list__sort-options"
                                    value={this.state.sortOption}
                                    onChange={this.handleSortOptionChange.bind(this)}>
                                    {this.renderSortOption()}
                                </select>
                            </div>
                        </fieldset>
                        <fieldset className="rcg-booking-list__sort-select-order" onChange={this.handleSortOrder.bind(this)}>
                            <input
                                className="rcg-booking-list__sort-radio"
                                type="radio"
                                name="sort"
                                value={SORT_ORDER.ASC}
                                defaultChecked={true} />
                            <label className="rcg-booking-list__sort-label rcg-booking-list__sort-label--order">Asc.</label>
                            <input
                                className="rcg-booking-list__sort-radio"
                                type="radio"
                                name="sort"
                                value={SORT_ORDER.DESC} />
                            <label className="rcg-booking-list__sort-label rcg-booking-list__sort-label--order">Desc.</label>
                        </fieldset>
                    </div>
                    {loadBookings}
                </div>
                <BookingDetails
                    details={this.props.bookingInformation}
                    fullView={this.props.fullView}
                    onBookingActionRequest={this.props.onBookingActionRequest}
                    bookingActionLoadingId={this.props.bookingActionLoadingId}
                    bookingActionResponse={this.props.bookingActionResponse} />
            </section>
        );
    }
}

BookingList.defaultProps = {
    bookings: [],
    onHideDetails: noop,
    onBookingItemClick: noop,
    onBookingActionRequest: noop
};

BookingList.propTypes = {
    fullView: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
    bookings: React.PropTypes.arrayOf(React.PropTypes.shape({
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
    })),
    onBookingItemClick: React.PropTypes.func,
    bookingInformation: React.PropTypes.shape({
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
    })
};
