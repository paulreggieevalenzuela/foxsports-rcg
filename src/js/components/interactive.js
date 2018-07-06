import React from 'react';
import noop from 'lodash/noop';
import find from 'lodash/find';
import get from 'lodash/get';

import InteractiveHeader from './interactive/header';
import InteractiveSidebar from './interactive/sidebar';
import BookingList from './booking-list';
import ConnectionReminder from './connection-reminder';

import {FILTER_TYPE, KEY_CODE} from '../utils/constants';

export default class Interactive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFullView: false,
            currentlySelectedBooking: props.bookings[0],
            freq: 0,
            connectionStatus: 'online'
        };
    }

    componentDidMount() {
        window.addEventListener('online',  this.updateOnlineStatus.bind(this));
        window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        const id = get(this.state, 'currentlySelectedBooking.id', null);
        const currentlySelectedBooking = find(nextProps.bookings, {id});

        this.setState({
            currentlySelectedBooking: currentlySelectedBooking || nextProps.bookings[0]
        });
    }

    componentWillUnmount() {
        window.removeEventListener('online',  this.updateOnlineStatus.bind(this));
        window.removeEventListener('offline',  this.updateOnlineStatus.bind(this));
    }

    handleBookingItemClicked(currentlySelectedBooking) {
        this.setState({currentlySelectedBooking});
    }

    handleShowIndicator() {
        this.setState({showFullView: true});
    }

    handleHideIndicator() {
        this.setState({showFullView: false});
    }

    handleSearchWorkOrderNumber(e) {
        if (e.charCode === KEY_CODE.ENTER) {
            if (e.target.value) {
                this.props.onFilterUpdate(FILTER_TYPE.WORK_ORDER_NUMBER, e.target.value);
                this.handleShowIndicator();
            }
        }
    }

    handleRefreshChange(e) {
        this.setState({freq: e.target.value});
        this.props.onUpdateRefreshFreq(e.target.value);
    }

    updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';

        this.setState({connectionStatus: status}, () => {
            if (status === 'offline') {
                setTimeout(() => { // Enough time to show the reminder component before reloading the page
                    location.reload();
                }, 3000);
            }
        });
    }

    render() {
        return (
            <div className="rcg-interactive">
                <ConnectionReminder connectionStatus={this.state.connectionStatus} />
                <InteractiveHeader
                    avidWorkspaces={this.props.avidWorkspaces}
                    onShowFullView={this.handleShowIndicator.bind(this)}
                    onEnter={this.handleSearchWorkOrderNumber.bind(this)}
                    onRefresh={this.handleRefreshChange.bind(this)}
                    onFilterUpdate={this.props.onFilterUpdate}
                    onBookingActionRequest={this.props.onBookingActionRequest}
                    bookingActionLoadingId={this.props.bookingActionLoadingId}
                    bookingActionResponse={this.props.bookingActionResponse} />

                <main className="rcg-interactive__body">
                    <InteractiveSidebar
                        handleHideIndicator={this.handleHideIndicator.bind(this)}
                        onFilterUpdate={this.props.onFilterUpdate}
                        onResetFilter={this.props.onResetFilter} />
                    <BookingList
                        isLoading={this.props.isLoading}
                        onBookingItemClick={this.handleBookingItemClicked.bind(this)}
                        bookings={this.props.bookings}
                        fullView={this.state.showFullView}
                        bookingInformation={this.state.currentlySelectedBooking}
                        details={this.props.bookings.job}
                        onBookingActionRequest={this.props.onBookingActionRequest}
                        bookingActionLoadingId={this.props.bookingActionLoadingId}
                        bookingActionResponse={this.props.bookingActionResponse} />
                </main>
            </div>
        );
    }
}

Interactive.defaultProps = {
    onFilterUpdate: noop,
    onUpdateRefreshFreq: noop,
    onBookingActionRequest: noop,
    bookings: []
};

Interactive.propTypes = {
    onFilterUpdate: React.PropTypes.func,
    onUpdateRefreshFreq: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    onResetFilter: React.PropTypes.func,
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
    avidWorkspaces: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string,
        enabled: React.PropTypes.bool
    }))
};
