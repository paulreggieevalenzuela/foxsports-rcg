
import {expect} from 'chai';
import bacon from 'baconjs';

import bookingActions from '../../../src/js/streams/booking-actions.js';

const restartJob = require('../../../src/js/streams/endpoints/restart-job');

describe('Job Actions', function () {
    beforeEach(function () {
        this.sampleSuccessResponse = {
            jobId: '123',
            response: {
                status: 200,
                message: 'SUCCESS'
            }
        };

        this.sampleFailedResponse = {
            jobId: '123',
            response: {
                status: 500,
                message: 'FAILED'
            }
        };

        this.onValueSpy = sinon.spy();
    });

    describe('type is \'Restart Job\'', function () {
        beforeEach(function () {
            this.restartJob = new bacon.Bus();

            sinon.stub(restartJob, 'default', () => this.restartJob);

            this.closeStream = bookingActions({
                jobId: '123',
                type: 'RESTART_JOB'
            }).onValue(this.onValueSpy);
        });

        afterEach(function () {
            this.closeStream();

            restartJob.default.restore();
        });

        it('request succeed', function () {
            this.restartJob.push(this.sampleSuccessResponse);

            expect(this.onValueSpy.firstCall.args[0]).to.be.deep.equal(this.sampleSuccessResponse);
        });

        it('request failed', function () {
            this.restartJob.push(this.sampleFailedResponse);

            expect(this.onValueSpy.firstCall.args[0]).to.be.deep.equal(this.sampleFailedResponse);
        });
    });

    describe('type is unrecognized', function () {
        beforeEach(function (done) {
            this.closeStream = bookingActions({
                jobId: '123',
                type: 'UNRECOGNIZED_TYPE'
            }).onValue(this.onValueSpy);

            setTimeout(() => {
                done();
            });
        });

        afterEach(function () {
            this.closeStream();
        });

        it('response should be \'JOB TYPE NOT RECOGNIZED\'', function () {
            expect(this.onValueSpy.firstCall.args[0]).to.be.equal('Job type not recognized');
        });
    });
});
