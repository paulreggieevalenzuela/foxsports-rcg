import React from 'react';
import ReactDOM from 'react-dom';
import bacon from 'baconjs';
import moment from 'moment';

import {page as pageBoot} from '@fsa/fs-commons/lib/iso/boot';

import InteractiveComponent from '../components/interactive';

import getSortedBookings from '../streams/sorted-bookings';
import bookingActions from '../streams/booking-actions';

import {FILTER_TYPE, DASHBOARD_TYPE, BOOKING_ACTION_TYPE, DATE_FORMAT} from '../utils/constants';

function Interactive(element, settings) {
    this.element = element;
    this.settings = settings;
}

Interactive.prototype.init = function (initialData = false) {
    this.closeStreams = this.getData(initialData)
        .onValue(this.render.bind(this));
};

Interactive.prototype.getData = function () {
    const dateToday = moment().format(DATE_FORMAT.DATE);
    const dateTomorrow = moment().add(1, 'day')
        .format(DATE_FORMAT.DATE);

    // we create seperate bus cause we want to retain individual filter previous value
    const dateFilterBus = new bacon.Bus();
    const freqFilterBus = new bacon.Bus();
    const statusFilterBus = new bacon.Bus();
    const searchWoNumberBus = new bacon.Bus();
    const bookingActionRequestBus = new bacon.Bus();

    const dateFilterStream = dateFilterBus.map((date) => date).startWith({
        from: dateToday,
        to: dateTomorrow
    });
    const statusFilterStream = statusFilterBus.map((status) => status).startWith(null);
    const freqFilterStream = freqFilterBus.map((freq) => freq).startWith(0);
    const searchWoNumberStream = searchWoNumberBus.map((woNumber) => woNumber).startWith(null);

    const filterStream = bacon.combineWith((date, status, freq, woNumber) => {
        if (woNumber) {
            // {from: null, to: null, status: null, woNumber: "454704", freq: 0…}
            return {
                from: null,
                to: null,
                status: null,
                woNumber,

                freq,
                dashboardType: DASHBOARD_TYPE.INTERACTIVE
            };
        } else if (status || date) {
            // {from: "2017-03-05", to: "2017-03-06", status: "SCHEDULED", woNumber: null, freq: 0…}
            return {
                from: date.from,
                to: date.to,
                status,
                woNumber: null,

                freq,
                dashboardType: DASHBOARD_TYPE.INTERACTIVE
            };
        }
    }, dateFilterStream, statusFilterStream, freqFilterStream, searchWoNumberStream);

    const bookingActionStream = bookingActionRequestBus.flatMapLatest(bookingActions);
    const bookingActionSuccess = bookingActionStream.startWith({});

    const restartJobSuccess = bookingActionSuccess
        .map((response) => {
            return response.type === BOOKING_ACTION_TYPE.RESTART_JOB ? true : new bacon.Error('not match');
        })
        .startWith(true);

    const bookingActionError = bookingActionStream
        .errors()
        .mapError((error) => error)
        .startWith(null);

    const bookingActionLoadingId = bacon.mergeAll(
        bookingActionRequestBus.map('.id'),
        bookingActionSuccess.map(0),
        bookingActionError.map(0)
    )
        .startWith(0);

    const avidWorkspaces = bookingActions({type: BOOKING_ACTION_TYPE.GET_AVID_WORKSPACES});

    const bookingActionResponse = bacon.mergeAll(
        bookingActionRequestBus.map(null),
        avidWorkspaces.map(null),
        bookingActionSuccess,
        bookingActionError
    )
        .startWith(null);

    const bookingsStream = filterStream
        .combine(restartJobSuccess, (filter) => filter)
        .skipErrors()
        .flatMapLatest(getSortedBookings);

    const isLoading = bacon.mergeAll(
        filterStream.map(true),
        restartJobSuccess.map(true),
        bookingsStream.map(false)
    ).toProperty(false);

    const handleFilterUpdate = (type, filter) => {
        switch (type) {
            case FILTER_TYPE.DATE:
                dateFilterBus.push(filter);
                searchWoNumberBus.push(null);
                break;
            case FILTER_TYPE.STATUS:
                statusFilterBus.push(filter);
                searchWoNumberBus.push(null);
                break;
            case FILTER_TYPE.WORK_ORDER_NUMBER:
                searchWoNumberBus.push(filter);
            default:
                break;
        }
    };

    const handleUpdateRefreshFreq = (frequency) => {
        freqFilterBus.push(frequency);
    };

    const handleBookingActionRequest = ({jobId, type, bookingId}) => {
        bookingActionRequestBus.push({
            id: jobId ? jobId : bookingId,
            type
        });
    };

    const handleResetFilter = () => {
        // {from: "<date today>", to: "<date tomorrow>", status: null, workOrderNumber: null}
        dateFilterBus.push({
            from: dateToday,
            to: dateTomorrow
        });
        statusFilterBus.push(null);
        searchWoNumberBus.push(null);
    };

    return bacon.combineTemplate({
        view: bacon.combineTemplate({
            bookings: bookingsStream,
            isLoading,
            bookingActionLoadingId,
            bookingActionResponse,
            avidWorkspaces,

            onFilterUpdate: handleFilterUpdate,
            onUpdateRefreshFreq: handleUpdateRefreshFreq,
            onBookingActionRequest: handleBookingActionRequest,
            onResetFilter: handleResetFilter
        }),
        iso: {}
    });
};

Interactive.prototype.render = function (data) {
    ReactDOM.render(
        <InteractiveComponent {...data.view} />,
        this.element
    );
};

Interactive.prototype.remove = function () {
    try {
        this.closeStreams();
    } catch (e) {} // eslint-disable-line no-empty

    try {
        if (this.element) {
            ReactDOM.unmountComponentAtNode(this.element);
        }
    } catch (e) {} // eslint-disable-line no-empty
};

export default function (element, settings) {
    return new Interactive(element, settings);
}

pageBoot(Interactive, 'rcg-interactive');
