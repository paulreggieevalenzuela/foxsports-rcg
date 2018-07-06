import {expect} from 'chai';
import moment from 'moment';
import find from 'lodash/find';

import {stopAll} from '@fsa/fs-commons/lib/request-manager/request-manager';

import getSortedBookings from '../../../src/js/streams/sorted-bookings.js';

import {JOB_TYPE, BOOKING_TYPE, JOB_TARGET_TYPE, STATIC_ATTR_VALUE, DASHBOARD_TYPE} from '../../../src/js/utils/constants';

const bookings = require('../../data/bookings/bookings.json');

describe('getSortedBookings', function () {
    beforeEach(function () {
        this.dateToday = moment().format('YYYY-MM-DD');
        this.onValueSpy = sinon.spy();

        // booking item with name 'FSN_FSN_TO_SKY_NZ_2016' is hardcoded to have the right properties
        // to be the first entry after sorting
        this.firstEntryAfterSorting = find(bookings, {name: 'FSN_FSN_TO_SKY_NZ_2016'});

        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            /bookings.json/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookings)
            ]
        );
    });

    afterEach(function () {
        this.server.restore();

        delete this.firstEntryAfterSorting;
    });


    it('Initial data is not sorted', function () {
        // before sort is applied, the entry that is suppose to be on top is at the middle
        expect(bookings[7]).to.deep.equal(this.firstEntryAfterSorting);
    });

    describe('Dashboard type is auto', function () {
        beforeEach(function (done) {
            this.firstEntryAfterSortingMassagedForAuto = {
                creation_date: this.firstEntryAfterSorting.creation_date,
                key: this.firstEntryAfterSorting.foxsports_booking_id,
                comms: STATIC_ATTR_VALUE.TBA,
                name: this.firstEntryAfterSorting.name,
                returnPath: this.firstEntryAfterSorting.bookingMetadata.returns,
                signalPath: this.firstEntryAfterSorting.bookingMetadata.signals,
                splits: this.firstEntryAfterSorting.bookingMetadata.splits,
                sport: this.firstEntryAfterSorting.bookingMetadata.sport,
                status: this.firstEntryAfterSorting.status,
                startDateTime: this.firstEntryAfterSorting.start,
                endDateTime: this.firstEntryAfterSorting.end,
                workOrderNumber: this.firstEntryAfterSorting.foxsports_booking_id
            };

            this.closeStream = getSortedBookings({
                from: this.dateToday,
                to: this.dateToday,
                freq: 0,
                dashboardType: DASHBOARD_TYPE.AUTO
            }).onValue(this.onValueSpy);

            setTimeout(() => {
                this.server.respond();
                done();
            });
        });

        afterEach(function () {
            this.server.restore();

            this.closeStream();

            this.firstEntryAfterSortingMassagedForAuto = null;

            stopAll();
        });

        it('should be massaged and sorted by status then date', function () {
            // after sort, entry with corrupted status & lowest time is now on top and is massaged for auto format
            expect(this.onValueSpy.firstCall.args[0][0]).to.be.deep.equal(this.firstEntryAfterSortingMassagedForAuto);
        });
    });

    describe('Dashboard type is interactive', function () {
        beforeEach(function (done) {
            const jobs = this.firstEntryAfterSorting.jobs.map((job) => {
                return {
                    jobId: job.id,
                    description: job.description,
                    priority: job.priority,
                    status: job.status,
                    createdDate: job.creation_date,
                    modifiedDate: job.modified_date,
                    failureReason: null,
                    routes: job.route_resources,
                    switchTime: job.switch_time
                };
            });

            this.firstEntryAfterSortingMassagedForInteractive = {
                workOrderNumber: this.firstEntryAfterSorting.foxsports_booking_id,
                status: this.firstEntryAfterSorting.status,
                name: this.firstEntryAfterSorting.name,
                id: this.firstEntryAfterSorting.id,
                creationDate: this.firstEntryAfterSorting.creation_date,
                workOrderSeqNumber: this.firstEntryAfterSorting.booking_id,
                modifiedDate: this.firstEntryAfterSorting.modified_date,
                type: BOOKING_TYPE.ROUTER_SWITCH_ONLY,
                startDateTime: this.firstEntryAfterSorting.start,
                fullPath: this.firstEntryAfterSorting.full_path_switching ? STATIC_ATTR_VALUE.YES : STATIC_ATTR_VALUE.NO,
                fullPathSwitching: this.firstEntryAfterSorting.full_path_switching,
                endDateTime: this.firstEntryAfterSorting.end,
                send_to_evs: this.firstEntryAfterSorting.send_to_evs,
                send_to_ardome: this.firstEntryAfterSorting.send_to_ardome,
                send_to_avid: this.firstEntryAfterSorting.send_to_avid,

                jobs
            };

            this.closeStream = getSortedBookings({
                from: this.dateToday,
                to: this.dateToday,
                freq: 0,
                dashboardType: DASHBOARD_TYPE.INTERACTIVE
            }).onValue(this.onValueSpy);

            this.server.respond();

            setTimeout(() => {
                done();
            });
        });

        afterEach(function () {
            this.server.restore();

            this.closeStream();

            this.firstEntryAfterSortingMassagedForInteractive = null;

            stopAll();
        });

        it('should be massaged and sorted by status then date', function () {
            // after sort, entry with corrupted status & lowest time is now on top and is massaged for interactive format
            expect(JSON.stringify(this.onValueSpy.firstCall.args[0][0]))
                .to.equal(JSON.stringify(this.firstEntryAfterSortingMassagedForInteractive));
        });

        describe('individual booking type', function () {
            it('should be Live Stream', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '462557'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.LIVE_STREAM);
            });

            it('should be SDN', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '455844'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.SDN);
            });

            it('should be EVS', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '462992'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.EVS);
            });

            it('should be Quantel', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '462109'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.QUANTEL);
            });

            it('should be \'EVS + Quantel\'', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '463277'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.EVS_AND_QUANTEL);
            });

            it('should be Router Switch', function () {
                const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '455097'});

                expect(booking.type).to.be.equal(BOOKING_TYPE.ROUTER_SWITCH_ONLY);
            });
        });

        describe('for job type Clip', function () {
            describe('and EVS job type', function () {
                it('target should be None', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '464447'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.NONE);
                        }
                    });
                });

                it('target should be EVS', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '462839'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.EVS);
                        }
                    });
                });

                it('target should be Avid', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '460395'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.AVID);
                        }
                    });
                });

                it('target should be Ardome', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '464578'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.ARDOME);
                        }
                    });
                });

                it('target should be EVS++Avid', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '459567'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.EVS_AVID);
                        }
                    });
                });

                it('target should be EVS++Ardome', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '461104'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.EVS_ARDOME);
                        }
                    });
                });

                it('target should be Avid++Ardome', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '460305'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.AVID_ARDOME);
                        }
                    });
                });

                it('target should be EVS++Avid++Ardome', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '460375'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal(JOB_TARGET_TYPE.EVS_AVID_ARDOME);
                        }
                    });
                });
            });

            describe('and none EVS job type', function () {
                it('target should be QUAXS02REC3 and equal to recorder', function () {
                    const booking = find(this.onValueSpy.firstCall.args[0], {workOrderNumber: '464472'});

                    booking.jobs.forEach((job) => {
                        if (job.description === JOB_TYPE.CLIP) {
                            expect(job.target).to.be.equal('QUAXS02REC3').and.to.be.equal(job.recorder);
                        }
                    });
                });
            });
        });
    });
});
