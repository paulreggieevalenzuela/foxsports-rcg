import bacon from 'baconjs';

/**
 * Get a list of hosts
 *
 * GET http://fsasydrcg.foxsports.com.au/rcg/rest/hosts
 *
 * Mock responses for now, first call returns a list of assorted hosts.
 * The second call returns the same list but with different enable property.
 *
 * @param  {Number}     options.jobId   Job Id - i.e. 1212397
 * @return {Observable}                 API response stream
 */
export default function getHosts() {
    const assortedWorkspaces = [
        {type: 'AVID', name: 'AVID_one', enabled: false},
        {type: 'AVID', name: 'AVID_two', enabled: true},
        {type: 'NOT_AVID', name: 'NOT_AVID_one', enabled: false},
        {type: 'AVID', name: 'AVID_three', enabled: true},
        {type: 'NOT_AVID', name: 'NOT_AVID_two', enabled: true}
    ];

    const assortedWorkspaces1 = [
        {type: 'AVID', name: 'AVID_one', enabled: false},
        {type: 'AVID', name: 'AVID_two', enabled: false},
        {type: 'AVID', name: 'AVID_three', enabled: true}
    ];

    // return bacon.later(0, assortedWorkspaces);

    return bacon.repeatedly(5000, [
        assortedWorkspaces,
        assortedWorkspaces1
    ]);
}
