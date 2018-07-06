import assign from 'lodash/assign';

import getBookings from './endpoints/bookings';

import {
    BOOKING_STATUS,
    SECOND_MS,
    SORT_ORDER,
    JOB_TYPE,
    BOOKING_TYPE,
    JOB_TARGET_TYPE,
    STATIC_ATTR_VALUE,
    DASHBOARD_TYPE,
    JOB_STATUS
} from '../utils/constants';
import {sortBy} from '../utils/helpers';

const firstBy = require('thenby');

/**
 * Get a list of bookings with polling
 *
 * http://fsasydrcg.foxsports.com.au/rcg/rest/bookings.json?from=2016-04-08&to=2016-04-09&status=RUNNING
 *
 * @param  {String}     options.from            Date range start (YYYY-MM-DD)
 * @param  {String}     options.tp              Date range end (YYYY-MM-DD)
 * @param  {String}     options.status          Booking status
 * @param  {Number}     options.freq            Polling frequency in seconds
 * @param  {Number}     options.woNumber        Work Order Number
 * @return {Observable}                         API response stream
 */
export default function getSortedBookings({
    from,
    to,
    status,
    woNumber,

    freq,
    dashboardType
}) {
    return getBookings({
        from,
        to,
        status,
        woNumber,

        freq: freq * SECOND_MS
    })
    .map((bookings) => {
        return getMassageBookingsData(dashboardType, bookings)
            .sort(
                firstBy(sortByStatus)
                    .thenBy((a, b) => sortBy('startDateTime', SORT_ORDER.ASC, a, b))
                    .thenBy((a, b) => sortBy('endDateTime', SORT_ORDER.ASC, a, b))
                    .thenBy((a, b) => sortBy('workOrderNumber', SORT_ORDER.ASC, a, b))
            );
    });
}

function getMassageBookingsData(dashboardType, bookings) {
    switch (dashboardType) {
        case DASHBOARD_TYPE.AUTO:
            return bookings.map((booking) => {
                return {
                    creation_date: booking.creation_date,

                    key: booking.foxsports_booking_id,
                    comms: STATIC_ATTR_VALUE.TBA,
                    name: booking.name,
                    returnPath: booking.bookingMetadata.returns,
                    signalPath: booking.bookingMetadata.signals,
                    splits: booking.bookingMetadata.splits,
                    sport: booking.bookingMetadata.sport,
                    status: booking.status,
                    startDateTime: booking.start,
                    endDateTime: booking.end,
                    workOrderNumber: booking.foxsports_booking_id
                };
            })
            .filter((booking) => {
                return (booking.status === BOOKING_STATUS.CORRUPTED || booking.status === BOOKING_STATUS.RUNNING);
            });

        case DASHBOARD_TYPE.INTERACTIVE:
            return bookings.map((booking) => {
                const defaultBooking = {
                    workOrderNumber: booking.foxsports_booking_id,
                    status: booking.status,
                    name: booking.name,
                    id: booking.id,
                    creationDate: booking.creation_date,
                    workOrderSeqNumber: booking.booking_id,
                    modifiedDate: booking.modified_date,
                    type: getBookingType(booking),
                    startDateTime: booking.start,
                    fullPath: booking.full_path_switching ? STATIC_ATTR_VALUE.YES : STATIC_ATTR_VALUE.NO,
                    fullPathSwitching: booking.full_path_switching,
                    endDateTime: booking.end,
                    send_to_evs: booking.send_to_evs,
                    send_to_ardome: booking.send_to_ardome,
                    send_to_avid: booking.send_to_avid
                };

                const jobs = booking.jobs.map((job) => {
                    const defaultFields = {
                        jobId: job.id,
                        description: job.description,
                        priority: job.priority,
                        status: job.status,
                        createdDate: job.creation_date,
                        modifiedDate: job.modified_date,
                        startTime: job.start,
                        endTime: job.end,
                        failureReason: job.failure_reason
                    };

                    const specificFields = massageByJobType(job, defaultBooking);

                    return assign(defaultFields, specificFields);
                });

                defaultBooking.jobs = jobs;

                return defaultBooking;
            });

        default:
            return bookings;
    }
}

// by default 'CORRUPTED' status takes presidence
function sortByStatus(a, b) {
    if (a.status === BOOKING_STATUS.CORRUPTED && b.status !== BOOKING_STATUS.CORRUPTED) {
        return -1;
    }

    if (a.status !== BOOKING_STATUS.CORRUPTED && b.status === BOOKING_STATUS.CORRUPTED) {
        return 1;
    }

    return 0;
}

function getBookingType(booking) {
    const jobs = booking.jobs;

    for (let i = jobs.length - 1; i >= 0; i--) {
        switch (jobs[i].description) {
            case JOB_TYPE.LIVE_STREAM:
                return BOOKING_TYPE.LIVE_STREAM;
            case JOB_TYPE.SDN:
                return BOOKING_TYPE.SDN;
            case JOB_TYPE.CLIP:
                return getBookingTypeForClip(jobs);
            default:
                break;
        }
    }

    return BOOKING_TYPE.ROUTER_SWITCH_ONLY;
}

function getBookingTypeForClip(jobs) {
    return jobs
        .filter(({description}) => description === JOB_TYPE.CLIP)
        .map(isEVSJob)
        .reduce((bookingType, isEvs) => {
            if (
                (bookingType === BOOKING_TYPE.EVS_AND_QUANTEL) ||
                (isEvs && bookingType === BOOKING_TYPE.QUANTEL) ||
                (!isEvs && bookingType === BOOKING_TYPE.EVS)
            ) {
                return BOOKING_TYPE.EVS_AND_QUANTEL;
            }

            return isEvs ? BOOKING_TYPE.EVS : BOOKING_TYPE.QUANTEL;
        }, undefined);
}

function massageByJobType(job, booking) {
    switch (job.description) {
        case JOB_TYPE.ROUTER_SWITCH:
            return {
                routes: job.route_resources,
                switchTime: job.switch_time
            };
        case JOB_TYPE.CLIP:
            return {
                name: job.name,
                clipId: job.clip_id,
                recorder: job.recorder ? job.recorder : STATIC_ATTR_VALUE.NONE,
                target: isEVSJob(job) ? getJobTarget(booking) : job.recorder,
                cc: job.closed_captioned ? STATIC_ATTR_VALUE.TRUE : STATIC_ATTR_VALUE.FALSE,
                destination: job.destination ? job.destination : STATIC_ATTR_VALUE.NONE,
                is_restart_clip_job: isRestartJob(job)
            };
        case JOB_TYPE.WO_STATUS_UPDATE:
            return {
                bookingStatus: job.booking_status,
                bookingMessage: (job.booking_message) ? job.booking_message : STATIC_ATTR_VALUE.NONE
            };
        case JOB_TYPE.LIVE_STREAM:
            return {
                eventId: job.liveStreamId,
                profileId: job.profileId,
                destination: STATIC_ATTR_VALUE.ELEMENTAL,
                backupNode: job.backupNode ? job.backupNode : STATIC_ATTR_VALUE.NONE,
                primaryNode: job.primaryNode,
                name: job.eventName,
                is_restart_livestream_job: isRestartJob(job)
            };
        case JOB_TYPE.SDN:
            return {
                worklogId: job.worklog,
                truck: job.truck,
                network: job.network,
                hostStatus: job.hoststatus,
                is_allow_test_network: job.status === BOOKING_STATUS.SCHEDULED
            };
        default:
            return {};
    }
}

function getJobTarget(booking) {
    let targets = [];

    if (booking.send_to_evs) {
        targets.push(JOB_TARGET_TYPE.EVS);
    }

    if (booking.send_to_avid) {
        targets.push(JOB_TARGET_TYPE.AVID);
    }

    if (booking.send_to_ardome) {
        targets.push(JOB_TARGET_TYPE.ARDOME);
    }

    return targets.length === 0 ? STATIC_ATTR_VALUE.NONE : targets.join('++');
}

function isRestartJob(job) {
    return isEVSJob(job) && job.status === JOB_STATUS.FAILED;
}

function isEVSJob(job) {
    return /^EVS/i.test(job.recorder);
}
