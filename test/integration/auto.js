import {expect} from 'chai';
import moment from 'moment';

import {stopAll} from '@fsa/fs-commons/lib/request-manager/request-manager';

import AutoDashboard from '../../src/js/widgets/auto';

const bookings = require('../data/bookings/bookings.json');

describe('Auto Dashboard', function () {
    before(function () {
        this.settings = {
            freq: 3
        };
    });

    beforeEach(function (done) {
        this.element = document.body.appendChild(document.createElement('div'));

        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            /bookings.json/,
            [
                200,
                {'Content-type': 'application/json'},
                JSON.stringify(bookings)
            ]
        );

        this.AutoDashboard = AutoDashboard(this.element, this.settings);

        this.AutoDashboard.init();
        this.server.respond();

        setTimeout(done);
    });

    afterEach(function () {
        this.server.restore();

        document.body.removeChild(this.element);

        stopAll();
    });

    describe('Auto Dashboard - Main Container', () => {
        it('Should render the main container', function () {
            expect(this.element.querySelector('.rcg-auto__main-container')).to.exist;
        });

        it('Should render the list container', function () {
            expect(this.element.querySelector('.rcg-auto__bookings')).to.exist;
        });
    });

    describe('Auto dashboard - Sidebar', () => {
        it('Should render the sidebar of the auto dashboard', function () {
            expect(this.element.querySelector('.rcg-auto__sidebar')).to.exist;
        });

        it('Should see the title of the dashboard', function () {
            expect(this.element.querySelector('.rcg-logo__title-auto').textContent)
                .to.equal('RCG Departure Tracker');
        });

        it('Should render the logo of the sidebar', function () {
            expect(this.element.querySelector('.rcg-logo__svg-auto svg')).to.exist;
        });

        it('Should render the panel date of the sidebar', function () {
            expect(this.element.querySelector('.rcg-date-details__auto')).to.exist;
        });

        it('Should render the same day in the panel date.', function () {
            const day = moment().format('dddd') + ',';

            expect(this.element.querySelector('.rcg-date-details__auto-week-day').textContent)
                .to.equal(day);
        });

        it('Should render the 2 timer/clock of the sidebar', function () {
            expect(this.element.querySelectorAll('.rcg-clock__auto'))
                .to.have.length(2);
        });

        it('Should render the same hours/units "HH" for the Sydney time.', function () {
            const sydTimezone = moment().tz('Australia/Sydney').format('HH');

            expect(this.element.querySelectorAll('time')[0].innerHTML.substring(0, 2))
                .to.equal(sydTimezone);
        });

        it('Should render the same hours/units "HH" for the UTC time.', function () {
            const utcTimezone = moment().utc().format('HH');

            expect(this.element.querySelectorAll('time')[1].innerHTML.substring(0, 2))
                .to.equal(utcTimezone);
        });
    });

    describe('Given the bookings data with a mix of running and corrupted bookings', () => {
        it('Should render all 8 rows of bookings data', function () {
            expect(this.element.querySelectorAll('.rcg-auto-bookings-list'))
                .to.have.length(7);
        });

        it('Should render the corrupted status in the top of the list.', function () {
            expect(this.element.querySelectorAll('.rcg-auto-bookings-list')[1].className)
                .to.equal('rcg-auto-bookings-list rcg-auto-bookings-list--corrupted');
        });

        it('Should render 5 rows of running list.', function () {
            expect(this.element.querySelectorAll('.rcg-auto-bookings-list--running'))
                .to.have.length(5);
        });

        it('Should render 3 list of corrupted list.', function () {
            expect(this.element.querySelectorAll('.rcg-auto-bookings-list--corrupted'))
                .to.have.length(2);
        });
    });
});
