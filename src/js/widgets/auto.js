import React from 'react';
import ReactDOM from 'react-dom';
import bacon from 'baconjs';
import moment from 'moment';

import {page as pageBoot}  from '@fsa/fs-commons/lib/iso/boot';

import getSortedBookings from '../streams/sorted-bookings';

import AutoDashboard from '../components/auto';

import {DASHBOARD_TYPE} from '../utils/constants';

function Auto(element, settings) {
    this.element  = element;
    this.settings = settings;
}

Auto.prototype.init = function (initialData = false) {
    this.closeStreams = this.getData(initialData)
        .onValue(this.render.bind(this));
};

Auto.prototype.getData = function () {
    const dateToday = moment().format('YYYY-MM-DD');
    const dateTomorrow = moment().add(1, 'day')
        .format('YYYY-MM-DD');

    const bookingsStream = getSortedBookings({
        from: dateToday,
        to: dateTomorrow,

        freq: this.settings.freq,
        dashboardType: DASHBOARD_TYPE.AUTO
    });

    return bacon.combineTemplate({
        view: {
            bookings: bookingsStream
        },
        iso: {}
    });
};

Auto.prototype.render = function (data) {
    ReactDOM.render(
        <AutoDashboard {...data.view} />,
        this.element
    );
};

/**
 * Removes the widget from the page and closes streams
 *
 * @return {undefined}
 */
Auto.prototype.remove = function () {
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
    return new Auto(element, settings);
}

/**
 * Calls the bootloader for the widget. The bootloader name is defined in fiso.js, e.g. 'video-mosaic'
 */
pageBoot(Auto, 'rcg-auto');
