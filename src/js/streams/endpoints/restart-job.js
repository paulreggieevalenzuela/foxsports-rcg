import bacon from 'baconjs';

let operation = false;

/**
 * Restart a failing Clip or Live Stream job
 *
 * POST http://fsasydrcg.foxsports.com.au//rcg/rest/bookings/restart_clip_job
 *
 * Mock responses for now, first call sends a SUCCESS result while the next one is FAILED.
 * This cycle is repeated indefinitely
 *
 * @param  {Number}     options.jobId   Job Id - i.e. 1212397
 * @return {Observable}                 API response stream
 */
export default function restartJob({
    id
}) {
    operation = !operation;

    if (operation) {
        return bacon.later(3000, {
            id,
            payload: {
                status: 200,
                message: 'SUCCESS'
            }
        });
    } else {
        return bacon.later(1000, new bacon.Error({
            id,
            payload: {
                status: 500,
                message: 'Internal Server Error'
            }
        }));
    }
}
