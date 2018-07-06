import bacon from 'baconjs';

let operation = false;

/**
 * Toggle avid workspace button
 *
 * POST http://fsasydrcg.foxsports.com.au/rest/hosts/<host.name>/toggle.json
 *
 * Mock responses for now, first call sends a SUCCESS result while the next one is FAILED.
 * This cycle is repeated indefinitely
 *
 * @param  {Number}     options.jobId   Job Id - i.e. 1212397
 * @return {Observable}                 API response stream
 */
export default function toggleAvidWorkspace({
    id
}) {
    operation = !operation;

    if (operation) {
        return bacon.later(2000, {
            id,
            payload: {
                status: 200,
                message: 'SUCCESS',
                result: {
                    enabled: true
                }
            }
        });
    } else {
        return bacon.later(1000, new bacon.Error({
            id,
            payload: {
                status: 500,
                message: 'Internal Server Error',
                result: {
                    enabled: false
                }
            }
        }));
    }
}
