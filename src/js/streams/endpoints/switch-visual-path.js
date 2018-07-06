import bacon from 'baconjs';

let operation = false;

/**
 * Switch Visual path for a booking
 *
 * POST http://fsasydrcg.foxsports.com.au//rcg/rest/bookings/<booking.id>/test_full_path_switch
 *
 * Mock responses for now, first call sends a SUCCESS result while the next one is FAILED.
 * This cycle is repeated indefinitely
 *
 * @param  {Number}     options.id   Job Id (1212397)
 * @return {Observable}              API response stream
 */
export default function switchVisualPath({
    id
}) {
    operation = !operation;

    if (operation) {
        return bacon.later(3000, {
            id,
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
    } else {
        return bacon.later(1000, new bacon.Error({
            id,
            payload: {
                success: false,
                status: 500,
                message: 'Internal Server Error'
            }
        }));
    }
}
