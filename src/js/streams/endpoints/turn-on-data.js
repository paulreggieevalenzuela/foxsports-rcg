import bacon from 'baconjs';

let operation = false;

/**
 * Turn on data for SDN job
 *
 * POST http://fsasydrcg.foxsports.com.au/rcg/rest/bookings/start_sdn_job
 *
 * Mock responses for now, first call sends a FAILED result while the next one is SUCCESS.
 * This cycle is repeated indefinitely
 *
 * @param  {Number}     options.jobId   Job Id - i.e. 1212397
 * @return {Observable}                 API response stream
 */
export default function turnOnJob({
    id
}) {
    operation = !operation;

    if (operation) {
        return bacon.later(1000, {
            id,
            payload: {
                status: 200,
                message: 'SUCCESS',
                result: {
                    worklog: '1488951714904',
                    truck: 'global-hd2',
                    network: 'network-nextgen',
                    start: '2017-03-05T17:39:20.917+11:00',
                    end: '2017-03-05T17:39:20.917+11:00',
                    hoststatus: 'foo-bar',
                    id: '1211085',
                    priority: 'LOW',
                    creation_date: '2017-03-15T17:39:20.917+11:00',
                    modified_date: '2017-03-15T17:39:20.917+11:00',
                    status: 'RUNNING',
                    failure_reason: null
                }
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
