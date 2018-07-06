import {expect} from 'chai';
import bacon from 'baconjs';

import {stopAll} from '@fsa/fs-commons/lib/request-manager/request-manager';
import {DATE_PERIOD, BOOKING_STATUS} from '../../src/js/utils/constants';

import Interactive from '../../src/js/widgets/interactive';

const getAvidWorkspacesStream = require('../../src/js/streams/endpoints/hosts');

const bookings = require('../data/bookings-for-reset-filters.json');

describe('[Interactive] - Reset Filters to default', function () {
    beforeEach(function (done) {
        this.element = document.body.appendChild(document.createElement('div'));

        this.getAvidWorkspacesBus = new bacon.Bus();
        sinon.stub(getAvidWorkspacesStream, 'default', () => this.getAvidWorkspacesBus);

        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            /bookings.json/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookings)
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

    describe('Render a status filter with option value of "running"', () => {
        beforeEach(function (done) {
            const dropdown = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-status-options')[0];

            dropdown.querySelector('option:nth-child(3)').click();

            dropdown.selectedIndex = 2;

            setTimeout(() => {
                setTimeout(() => {
                    done();
                });
            });
        });

        it('Should render the status filter with option value of "running".', function () {
            expect(this.element.querySelector('.rcg-interactive-sidebar__filter-status-options').value).to.equal(BOOKING_STATUS.RUNNING);
        });

        it('Should render list with "running" status only', function () {
            expect(this.element.querySelectorAll('.rcg-booking-list__icon--running')).to.have.length(2);
        });

        it('Should not render any other list', function () {
            expect(this.element.querySelectorAll('.rcg-booking-list__icon--processed')).to.have.length(0);
        });

        describe('Reset a status filter option value from "Running" to "All"', () => {
            beforeEach(function (done) {
                const resetFilterButton = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-reset-button')[0];

                resetFilterButton.click();

                setTimeout(() => {
                    setTimeout(() => {
                        done();
                    });
                });
            });

            it('Should render the status filter with option value of "ALL".', function () {
                expect(this.element.querySelector('.rcg-interactive-sidebar__filter-status-options').value).to.equal(BOOKING_STATUS.ALL);
            });

            it('Should render all 12 rows of bookings', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item')).to.have.length(12);
            });
        });
    });

    describe('Render a date filter with option value of "custom date range"', () => {
        beforeEach(function (done) {
            const dropdown = this.element.querySelectorAll('.rcg-date-picker__period-options')[0];

            dropdown.querySelector('option:nth-child(4)').click();

            dropdown.selectedIndex = 3;

            setTimeout(() => {
                setTimeout(() => {
                    done();
                });
            });
        });

        it('Should render the date filter option with option value of "custom date range".', function () {
            expect(this.element.querySelector('.rcg-date-picker__period-options').value).to.equal(DATE_PERIOD.CUSTOM_RANGE);
        });

        describe('Reset a date filter option value from "Custom Range" to "Today"', () => {
            beforeEach(function (done) {
                const resetFilterButton = this.element.querySelectorAll('.rcg-interactive-sidebar__filter-reset-button')[0];

                resetFilterButton.click();

                setTimeout(() => {
                    setTimeout(() => {
                        done();
                    });
                });
            });

            it('Should render the filter date with option value of "today".', function () {
                expect(this.element.querySelector('.rcg-date-picker__period-options').value).to.equal(DATE_PERIOD.TODAY);
            });

            it('Should render all 12 rows of bookings', function () {
                expect(this.element.querySelectorAll('.rcg-booking-list__list-item')).to.have.length(12);
            });
        });
    });
});

