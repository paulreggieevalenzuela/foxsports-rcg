import bacon from 'baconjs';

import restartJob from './endpoints/restart-job';
import turnOnData from './endpoints/turn-on-data';
import switchVisualPath from './endpoints/switch-visual-path';
import getHosts from './endpoints/hosts';
import toggleAvidWorkspace from './endpoints/toggle-avid-workspace';

import {BOOKING_ACTION_TYPE} from '../utils/constants';

/**
 * Return different job responses based on job type
 *
 * @param  {Number}     options.jobId   Job Id (1212397)
 * @param  {String}     options.Type    Job Type (RESTART_JOB, etc)
 * @return {Observable}                 API response stream
 */
export default function jobActions({
    id,
    type
}) {
    switch (type) {
        case BOOKING_ACTION_TYPE.RESTART_JOB:
            return restartJob({
                id
            });
        case BOOKING_ACTION_TYPE.TURN_ON_DATA:
            return turnOnData({
                id
            });
        case BOOKING_ACTION_TYPE.SWITCH_VISUAL_PATH:
            return switchVisualPath({
                id
            });
        case BOOKING_ACTION_TYPE.GET_AVID_WORKSPACES:
            return getHosts().map((workspaces) => workspaces.filter(({type}) => type === 'AVID'));
        case BOOKING_ACTION_TYPE.TOGGLE_AVID_WORKSPACE:
            return toggleAvidWorkspace({
                id
            });
        default:
            return bacon.later(0, 'Job type not recognized');
    }
}
