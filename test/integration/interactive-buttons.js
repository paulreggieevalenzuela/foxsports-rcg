import {expect} from 'chai';
import bacon from 'baconjs';
import moment from 'moment';

import {stopAll} from '@fsa/fs-commons/lib/request-manager/request-manager';

import Interactive from '../../src/js/widgets/interactive';

import {DATE_FORMAT} from '../../src/js/utils/constants';
import {xpath, xpathPrefix} from '../utils/helpers';

const restartJobStream = require('../../src/js/streams/endpoints/restart-job');
const turnOnDataStream = require('../../src/js/streams/endpoints/turn-on-data');
const switchVisualPathStream = require('../../src/js/streams/endpoints/switch-visual-path');
const getAvidWorkspacesStream = require('../../src/js/streams/endpoints/hosts');
const toggleAvidWorkspaceStream = require('../../src/js/streams/endpoints/toggle-avid-workspace');

const bookingsWithButtons = require('../data/bookings/bookings-with-buttons.json');

describe('Interactive dashboard buttons', function () {
    beforeEach(function (done) {
        this.onValueSpy = sinon.spy();
        this.element = document.body.appendChild(document.createElement('div'));

        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            /bookings.json/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(bookingsWithButtons)
            ]
        );

        this.restartJobBus = new bacon.Bus();
        this.turnOnDataBus = new bacon.Bus();
        this.switchVisualPathBus = new bacon.Bus();
        this.getAvidWorkspacesBus = new bacon.Bus();
        this.toggleAvidWorkspaceBus = new bacon.Bus();

        sinon.stub(restartJobStream, 'default', () => this.restartJobBus);
        sinon.stub(turnOnDataStream, 'default', () => this.turnOnDataBus);
        sinon.stub(switchVisualPathStream, 'default', () => this.switchVisualPathBus);
        sinon.stub(getAvidWorkspacesStream, 'default', () => this.getAvidWorkspacesBus);
        sinon.stub(toggleAvidWorkspaceStream, 'default', () => this.toggleAvidWorkspaceBus);

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

        restartJobStream.default.restore();
        turnOnDataStream.default.restore();
        switchVisualPathStream.default.restore();
        getAvidWorkspacesStream.default.restore();
        toggleAvidWorkspaceStream.default.restore();

        stopAll();
    });

    describe('Restart button', () => {
        beforeEach(function (done) {
            this.element.querySelectorAll('.rcg-booking-list__list-item')[0].click();

            setTimeout(done);
        });

        it('Should render loading state', function () {
            this.element.querySelectorAll('.rcg-job__restart-button')[0].click();

            setTimeout(() => {
                expect(this.element.querySelector('.fa fa-spinner fa-spin')).to.exist;
            });
        });

        it('Should render SUCCESS', function () {
            this.element.querySelectorAll('.rcg-job__restart-button')[0].click();

            this.restartJobBus.push({
                id: 1210563,
                payload: {
                    status: 200,
                    message: 'SUCCESS'
                }
            });

            setTimeout(() => {
                expect(this.element.querySelectorAll('.rcg-job__restart-message')[0].textContent).to.equal('SUCCESS');
            });
        });

        it('Should render FAILED', function () {
            this.element.querySelectorAll('.rcg-job__restart-button')[1].click();

            this.restartJobBus.push({
                id: 1207096,
                payload: {
                    status: 500,
                    message: 'ISE'
                }
            });

            setTimeout(() => {
                expect(this.element.querySelectorAll('.rcg-job__restart-message')[1].textContent).to.equal('ISE');
            });
        });
    });

    describe('Turn on data button', () => {
        beforeEach(function (done) {
            this.element.querySelectorAll('.rcg-booking-list__list-item')[1].click();

            setTimeout(done);
        });

        it('Should render loading state', function () {
            this.element.querySelectorAll('.rcg-job__turn-on-data-button')[0].click();

            setTimeout(() => {
                expect(this.element.querySelector('.fa fa-spinner fa-spin')).to.exist;
            });
        });

        it('Should render FAILED', function () {
            this.element.querySelectorAll('.rcg-job__turn-on-data-button')[0].click();

            this.restartJobBus.push({
                id: 1207096,
                payload: {
                    status: 500,
                    message: 'ISE'
                }
            });

            setTimeout(() => {
                expect(this.element.querySelectorAll('.turn-on-message')[0].textContent).to.equal('ISE');
            });
        });

        describe('response is success', function () {
            before(function () {
                if (!document.evaluate) {
                    this.skip();
                }
            });

            beforeEach(function () {
                this.element.querySelectorAll('.rcg-job__turn-on-data-button')[0].click();

                this.turnOnDataBus.push({
                    id: 1211084,
                    payload: {
                        status: 200,
                        message: 'SUCCESS',
                        result: {
                            worklog: '1488951714904',
                            truck: 'global-hd2',
                            network: 'network-nextgen-1',
                            start: '2017-03-01T17:39:20.917+11:00',
                            end: '2017-03-01T17:39:20.917+11:00',
                            hoststatus: 'foo-bar',
                            id: '1211085',
                            priority: 'LOW',
                            creation_date: '2017-03-01T17:39:20.917+11:00',
                            modified_date: '2017-03-01T17:39:20.917+11:00',
                            status: 'RUNNING',
                            failure_reason: 'ISE'
                        }
                    }
                });
            });

            it('should update Job Id field', function () {
                const jobId = this.element.querySelectorAll('.rcg-booking-details-job__status-block-number')[0];

                expect(jobId.textContent).to.match(/1211085/);
            });

            it('should update Priority field', function () {
                const priority = xpath(xpathPrefix('TABLE_ROW', 'Priority'))[0];

                expect(priority.textContent).to.equal('LOW');
            });

            it('should update Created date', function () {
                const createDate = xpath(xpathPrefix('TABLE_ROW', 'Created'))[0];

                expect(createDate.textContent).to.equal(moment('2017-03-01T17:39:20.917+11:00').format(DATE_FORMAT.INTERACTIVE));
            });

            it('should update Modified date', function () {
                const modifiedDate = xpath(xpathPrefix('TABLE_ROW', 'Modified'))[0];

                expect(modifiedDate.textContent).to.equal(moment('2017-03-01T17:39:20.917+11:00').format(DATE_FORMAT.INTERACTIVE));
            });

            it('should update Worklog Id field', function () {
                const worklogId = xpath(xpathPrefix('TABLE_ROW', 'Worklog ID'))[0];

                expect(worklogId.textContent).to.equal('1488951714904');
            });

            it('should update Truck field', function () {
                const truck = xpath(xpathPrefix('TABLE_ROW', 'Truck'))[0];

                expect(truck.textContent).to.equal('global-hd2');
            });

            it('should update Network field', function () {
                const network = xpath(xpathPrefix('TABLE_ROW', 'Network'))[0];

                expect(network.textContent).to.equal('network-nextgen-1');
            });

            it('should update Host Status field', function () {
                const hostStatus = xpath(xpathPrefix('TABLE_ROW', 'Host Status'))[0];

                expect(hostStatus.textContent).to.equal('foo-bar');
            });

            it('should update Start Time field', function () {
                const startTime = xpath(xpathPrefix('TABLE_ROW', 'Start Time'))[0];

                expect(startTime.textContent)
                    .to.equal(moment('2017-03-01T17:39:20.917+11:00').format(DATE_FORMAT.INTERACTIVE));
            });

            it('should update End Time field', function () {
                const endTime = xpath(xpathPrefix('TABLE_ROW', 'End Time'))[0];

                expect(endTime.textContent)
                    .to.equal(moment('2017-03-01T17:39:20.917+11:00').format(DATE_FORMAT.INTERACTIVE));
            });
        });
    });

    describe('Switch visual path button', function () {
        beforeEach(function (done) {
            this.element.querySelectorAll('.rcg-booking-list__list-item')[2].click();

            setTimeout(done);
        });

        describe('Http request is successful', function () {
            beforeEach(function () {
                this.element.querySelectorAll('.rcg-booking-details__switch-button')[0].click();

                this.switchVisualPathBus.push({
                    id: 338103,
                    payload: {
                        success: true,
                        status: 200,
                        details: [
                            {
                                success: true,
                                route: {
                                    destination: 'TBS TX 3-12',
                                    source: 'ISDN 2'
                                },
                                details: {
                                    error: ''
                                }
                            },
                            {
                                success: false,
                                route: {
                                    destination: 'hello',
                                    source: 'world'
                                },
                                details: {
                                    error: 'Switch Failed'
                                }
                            }

                        ]
                    }
                });
            });

            it('Should render a job with switch success', function () {
                expect(this.element.querySelectorAll('.rcg-booking-details-job__status')[0].textContent).to.equal('Switch Success');
            });

            it('Should render a job with switch failed', function () {
                expect(this.element.querySelectorAll('.rcg-booking-details-job__status')[1].textContent).to.equal('Switch Failed');
            });

            it('Should render a job with switch ignore', function () {
                expect(this.element.querySelectorAll('.rcg-booking-details-job__status')[2].textContent).to.equal('Switch Ignored');
            });
        });

        describe('Http request has failed', function () {
            beforeEach(function () {
                this.element.querySelectorAll('.rcg-booking-details__switch-button')[0].click();

                this.switchVisualPathBus.push({
                    id: 338103,
                    payload: {
                        success: false,
                        status: 500,
                        message: 'Internal Server Error'
                    }
                });
            });

            it('Should render error message', function () {
                expect(this.element.querySelectorAll('.rcg-booking-details__switch-error-message')[0].textContent)
                    .to.equal('Could not switch visual path: Internal Server Error');
            });
        });
    });

    describe('Avid workspaces buttons', () => {
        describe('Should render initially', function () {
            it('avid-one should be toggle off', function () {
                const label = this.element.querySelectorAll('label[for=AVID_one-b]')[0];

                expect(label.textContent).to.be.equal('OFF');
            });

            it('avid-two should be toggle off', function () {
                const label = this.element.querySelectorAll('label[for=AVID_two-b]')[0];

                expect(label.textContent).to.be.equal('OFF');
            });

            it('avid-two should be toggle one', function () {
                const label = this.element.querySelectorAll('label[for=AVID_three-b]')[0];

                expect(label.textContent).to.be.equal('ON');
            });
        });

        describe('Should update when new data is given', function () {
            beforeEach(function (done) {
                this.getAvidWorkspacesBus.push([
                    {type: 'AVID', name: 'AVID_one-b', enabled: true},
                    {type: 'AVID', name: 'AVID_two-b', enabled: true},
                    {type: 'AVID', name: 'AVID_three-b', enabled: false}
                ]);

                setTimeout(done);
            });

            it('where avid-one should now be toggle on', function () {
                const label = this.element.querySelectorAll('label[for=AVID_one-b]')[0];

                expect(label.textContent).to.be.equal('ON');
            });

            it('where avid-two should now be toggle on', function () {
                const label = this.element.querySelectorAll('label[for=AVID_two-b]')[0];

                expect(label.textContent).to.be.equal('ON');
            });

            it('where avid-two should now be toggle off', function () {
                const label = this.element.querySelectorAll('label[for=AVID_three-b]')[0];

                expect(label.textContent).to.be.equal('OFF');
            });
        });

        describe('Toggle is individually clicked', function () {
            beforeEach(function (done) {
                this.getAvidWorkspacesBus.push([
                    {type: 'AVID', name: 'AVID_one-b', enabled: true},
                    {type: 'AVID', name: 'AVID_two-b', enabled: true},
                    {type: 'AVID', name: 'AVID_three-b', enabled: false}
                ]);

                setTimeout(done);
            });

            it('avid-three when clicked should update to ON', function () {
                this.element.querySelectorAll('input[id=AVID_one-b]')[0].click();

                this.toggleAvidWorkspaceBus.push({
                    id: 'AVID_three-b',
                    payload: {
                        status: 200,
                        message: 'SUCCESS',
                        result: {
                            enabled: true
                        }
                    }
                });

                const label = this.element.querySelectorAll('label[for=AVID_three-b]')[0];

                expect(label.textContent).to.be.equal('ON');
            });

            it('avid-two when clicked should still be ON', function () {
                this.element.querySelectorAll('input[id=AVID_two-b]')[0].click();

                this.toggleAvidWorkspaceBus.push({
                    id: 'AVID_two-b',
                    payload: {
                        status: 200,
                        message: 'SUCCESS',
                        result: {
                            enabled: true
                        }
                    }
                });

                const label = this.element.querySelectorAll('label[for=AVID_two-b]')[0];

                expect(label.textContent).to.be.equal('ON');
            });
        });
    });
});
