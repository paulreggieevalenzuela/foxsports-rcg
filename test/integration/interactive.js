import {expect} from 'chai';
import bacon from 'baconjs';
import moment from 'moment';
import escapeRegExp from 'lodash/escapeRegExp';
import ReactTestUtils from 'react-addons-test-utils';

import {stopAll} from '@fsa/fs-commons/lib/request-manager/request-manager';

import Interactive from '../../src/js/widgets/interactive';

import {DATE_FORMAT, BOOKING_STATUS} from '../../src/js/utils/constants';

const getAvidWorkspacesStream = require('../../src/js/streams/endpoints/hosts');

const bookingWithStatuses = require('../data/bookings/bookings-status.json');
const bookingsLastWeek = require('../data/bookings/bookings-last-week');
const bookingsLastMonth = require('../data/bookings/bookings-last-month');

describe('Interactive dashboard', function () {
    before(function () {
        this.dateToday = moment().format(DATE_FORMAT.DATE);
        this.dateTomorrow = moment().add(1, 'day')
            .format(DATE_FORMAT.DATE);
        this.dateLastWeek = moment().subtract(7, 'day')
            .format(DATE_FORMAT.DATE);
        this.dateLastMonth = moment().subtract(1, 'month')
            .format(DATE_FORMAT.DATE);
    });

    beforeEach(function (done) {
        const scheduledBookings = bookingWithStatuses.filter((booking) => booking.status === BOOKING_STATUS.SCHEDULED);
        const runningBookings = bookingWithStatuses.filter((booking) => booking.status === BOOKING_STATUS.RUNNING);
        const processedBookings = bookingWithStatuses.filter((booking) => booking.status === BOOKING_STATUS.PROCESSED);
        const corruptedBookings = bookingWithStatuses.filter((booking) => booking.status === BOOKING_STATUS.CORRUPTED);
        const cancelledBookings = bookingWithStatuses.filter((booking) => booking.status === BOOKING_STATUS.CANCELLED);

        const lastWeekPath = escapeRegExp(`bookings.json?from=${this.dateLastWeek}&to=${this.dateTomorrow}`);
        const lastMonthPath = escapeRegExp(`bookings.json?from=${this.dateLastMonth}&to=${this.dateTomorrow}`);
        const lastWeekPattern = new RegExp(lastWeekPath + '$', 'gi');
        const lastMonthPattern = new RegExp(lastMonthPath + '$', 'gi');

        this.onValueSpy = sinon.spy();
        this.element = document.body.appendChild(document.createElement('div'));

        this.getAvidWorkspacesBus = new bacon.Bus();
        sinon.stub(getAvidWorkspacesStream, 'default', () => this.getAvidWorkspacesBus);


        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            /bookings.json/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookingWithStatuses)
            ]
        );
        this.server.respondWith(
            /bookings.json(.*)status=SCHEDULED/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(scheduledBookings)
            ]
        );
        this.server.respondWith(
            /bookings.json(.*)status=RUNNING/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(runningBookings)
            ]
        );
        this.server.respondWith(
            /bookings.json(.*)status=PROCESSED/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(processedBookings)
            ]
        );
        this.server.respondWith(
            /bookings.json(.*)status=CORRUPTED/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(corruptedBookings)
            ]
        );
        this.server.respondWith(
            /bookings.json(.*)status=CANCELLED/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(cancelledBookings)
            ]
        );

        this.server.respondWith(
            /bookings.json(.*)status=CANCELLED/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(cancelledBookings)
            ]
        );
        this.server.respondWith(
            lastWeekPattern,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookingsLastWeek)
            ]
        );
        this.server.respondWith(
            lastMonthPattern,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookingsLastMonth)
            ]
        );

        this.Interactive = Interactive(this.element, {});
        this.Interactive.init();

        this.server.respond();

        this.getAvidWorkspacesBus.push([
            {type: 'AVID', name: 'AVID_one-b', enabled: false},
            {type: 'AVID', name: 'AVID_two-b', enabled: false},
            {type: 'AVID', name: 'AVID_three-b', enabled: true}
        ]);

        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    done();
                });
            });
        });
    });

    afterEach(function () {
        this.Interactive.remove();

        document.body.removeChild(this.element);

        this.server.restore();

        getAvidWorkspacesStream.default.restore();

        stopAll();
    });

    describe('Main Container', function () {
        it('Should render the header', function () {
            expect(this.element.querySelector('.rcg-interactive-header')).to.exist;
        });

        it('Should render the sidebar', function () {
            expect(this.element.querySelector('.rcg-interactive-sidebar')).to.exist;
        });

        it('Should render the bookings container', function () {
            expect(this.element.querySelector('.rcg-booking-list')).to.exist;
        });
    });

    describe('Navbar', function () {
        it('Should render the Foxsports logo', function () {
            expect(this.element.querySelector('.rcg-logo__svg-interactive')).to.exist;
        });

        it('Should render the title', function () {
            expect(this.element.querySelector('.rcg-logo__title-interactive').textContent)
                .to.equal('RCG Departure Tracker');
        });

        it('Should render the date today', function () {
            const day = moment().format('dddd') + ',';

            expect(this.element.querySelector('.rcg-date-details__interactive-week-day').textContent)
                .to.equal(day);
        });

        it('Should render the Sydney time', function () {
            const sydTimezone = moment().tz('Australia/Sydney').format('HH');

            expect(this.element.querySelectorAll('time')[0].innerHTML.substring(0, 2))
                .to.equal(sydTimezone);
        });

        it('Should render the UTC time', function () {
            const utcTimezone = moment().utc().format('HH');

            expect(this.element.querySelectorAll('time')[1].innerHTML.substring(0, 2))
                .to.equal(utcTimezone);
        });
    });

    describe('Table list', () => {
        beforeEach(function (done) {
            const tableList = this.element.querySelectorAll('.rcg-booking-list__list-item')[1];

            tableList.click();

            setTimeout(done);
        });

        it('Should render the same title for the list and the list description.', function () {
            const bookings = this.element.querySelectorAll('.rcg-booking-list__list-item')[1];
            const bookingsTitle = bookings.querySelectorAll('.rcg-booking-list__item-info-title')[0];

            const bookingDetailsTitle = this.element.querySelectorAll('.rcg-booking-details__info-title')[0];

            expect(bookingsTitle.textContent).to.equal(bookingDetailsTitle.textContent);
        });
    });

    describe('Status filter', function () {
        describe('set to scheduled', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

                dropdown.selectedIndex = 1;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with scheduled only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(6);
            });
        });

        describe('set to running', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

                dropdown.selectedIndex = 2;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with running only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(2);
            });
        });

        describe('set to processed', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

                dropdown.selectedIndex = 3;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with processed only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(1);
            });
        });

        describe('set to corrupted', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

                dropdown.selectedIndex = 4;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with corrupted only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(2);
            });
        });

        describe('set to cancelled', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

                dropdown.selectedIndex = 5;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with cancelled only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(1);
            });
        });
    });

    describe('Date filter', function () {
        describe('set to last week', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-date-picker__period-options')[0];

                dropdown.selectedIndex = 1;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with scheduled only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(3);
            });
        });

        describe('set to last month', function () {
            beforeEach(function (done) {
                const dropdown = this.element.querySelectorAll('.rcg-date-picker__period-options')[0];

                dropdown.selectedIndex = 2;

                ReactTestUtils.Simulate.change(dropdown);

                this.server.respond();

                setTimeout(done);
            });

            it('Should render list with scheduled only', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item').length).to.equal(8);
            });
        });
    });
});
