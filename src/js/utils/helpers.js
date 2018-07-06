import querystring from 'querystring';
import moment from 'moment';

import {BOOKING_STATUS, JOB_STATUS, SORT_ORDER, ACCEPTED_DATE_FORMATS, SWITCH_RESULT_STATUS} from './constants';

/**
 * Pull out undefined properties before stringifying using node's querystring.
 * Note that empty string, null or empty object will all be unaffected
 *
 * @param  {Object} argsObj Object containing properties which may be undefined
 * @return {String}         querystring.stringify without undefined properties
 */
export function nicerStringify(argsObj) {
    if (!argsObj) {
        return '';
    }

    const noUndefinedAndNullProperties = Object.keys(argsObj).reduce((returnObj, key) => {
        if (argsObj[key] !== undefined && argsObj[key] !== null) {
            returnObj[key] = argsObj[key];
        }

        return returnObj;
    }, {});

    return querystring.stringify(noUndefinedAndNullProperties);
}

/**
 * Return the ordinal indicator of a number
 *
 * @param  {Number} i Number provided
 * @return {String}   Ordinal suffix (st, nd, rd th)
 */
export function getOrdinalSuffix(i) {
    const j = i % 10,
        k = i % 100;

    if (j === 1 && k !== 11) {
        return 'st';
    }

    if (j === 2 && k !== 12) {
        return 'nd';
    }

    if (j === 3 && k !== 13) {
        return 'rd';
    }

    return 'th';
}

/**
 * Return appropriate class suffix based on booking status
 *
 * @param  {String} className       Prefix of the class
 * @param  {String} bookingStatus   Booking status
 * @return {Array}                  Classnames with status modifier suffix
 */
export function getAllBookingStatusModifiers(className, bookingStatus) {
    return [
        {[`${className}--scheduled`]: (bookingStatus === BOOKING_STATUS.SCHEDULED)},
        {[`${className}--cancelled`]: (bookingStatus === BOOKING_STATUS.CANCEL)},
        {[`${className}--corrupted`]: (bookingStatus === BOOKING_STATUS.CORRUPTED)},
        {[`${className}--running`]: (bookingStatus === BOOKING_STATUS.RUNNING)},
        {[`${className}--processed`]: (bookingStatus === BOOKING_STATUS.PROCESSED)}
    ];
}

/**
 * Return appropriate class suffix based on booking status
 *
 * @param  {String} className       Prefix of the class
 * @param  {String} jobStatus       Job status
 * @return {Array}                  Classnames with status modifier suffix
 *
 * eg. .rcg-booking-details-job__header-status--scheduled
 */
export function getAllJobStatusModifiers(className, jobStatus) {
    return [
        {[`${className}--scheduled`]: (jobStatus === JOB_STATUS.SCHEDULED)},
        {[`${className}--completed`]: (jobStatus === JOB_STATUS.COMPLETED)},
        {[`${className}--running`]: (jobStatus === JOB_STATUS.RUNNING)},
        {[`${className}--failed`]: (jobStatus === JOB_STATUS.FAILED)},
        {[`${className}--switch-success`]: (jobStatus === SWITCH_RESULT_STATUS.SWITCH_SUCCESS)},
        {[`${className}--switch-failed`]: (jobStatus === SWITCH_RESULT_STATUS.SWITCH_FAILED)},
        {[`${className}--switch-ignored`]: (jobStatus === SWITCH_RESULT_STATUS.SWITCH_IGNORED)}
    ];
}

/**
 * Sorting function that compares two objects using a given key and returns a numeric index
 * Sorted in descending order by default
 *
 * @param  {String} key     Object key used to determine which property to sort
 * @param  {String} order   Sort order either ASC or DESC
 * @param  {Object} a       First object to compare
 * @param  {Object} b       Second object to compare
 * @return {Number}         Sort order (-1, 1 or 0)
 */
export function sortBy(key, order, a, b) {
    const valueA = (moment(a[key], ACCEPTED_DATE_FORMATS, true).isValid()) ? new Date(a[key]).getTime() : a[key];
    const valueB = (moment(b[key], ACCEPTED_DATE_FORMATS, true).isValid()) ? new Date(b[key]).getTime() : b[key];

    const sortOrder = (valueA < valueB) ? -1 : 1; // DESC
    const reverseIfAsc = (order === SORT_ORDER.ASC) ? 1 : -1;

    return (valueA === valueB) ? 0 : sortOrder * reverseIfAsc;
}
