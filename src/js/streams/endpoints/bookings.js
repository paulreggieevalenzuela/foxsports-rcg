import bacon from 'baconjs';

import {getApiFromRetryWithError} from '@fsa/fs-commons/lib/request-manager/streams';

import {nicerStringify} from '../../utils/helpers';
import {RCG_BASE_URL} from '../../utils/constants';

/**
 * Get a list of bookings
 *
 * http://fsasydrcg.foxsports.com.au/rcg/rest/bookings.json?from=2016-04-08&to=2016-04-09&status=RUNNING
 *
 * @param  {String}     options.from            Date range start
 * @param  {String}     options.to              Date range end
 * @param  {String}     options.status          Booking Status (RUNNING)
 * @param  {Number}     options.freq            Polling frequency
 * @param  {Number}     options.woNumber        Work Order Number
 * @return {Observable}                         API response stream
 */
export default function getBookings({
    from,
    to,
    status,
    woNumber = null,

    freq
}) {
    let url;

    if (woNumber) {
        url = `${RCG_BASE_URL}/bookings.json?wonum=${woNumber}`;
    } else {
        url = `${RCG_BASE_URL}/bookings.json?` +
            nicerStringify({
                from,
                to,
                status
            });
    }

    return getApiFromRetryWithError({freq, url})
        .flatMapLatest((response) => {
            if (response.responseConsideredValid) {
                return response.parseResponseText();
            }

            const errorMessage = `FS-RCG: unable to get bookings data (${url}): ${response.responseStatus} ${response.superAgentErr}`; // eslint-disable-line max-len

            return new bacon.Error(errorMessage);
        });
}
