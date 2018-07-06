import moment from 'moment';

export const ACCEPTED_DATE_FORMATS = [
    moment.ISO_8601
];

export const BOOKING_STATUS = {
    ALL: 'ALL',
    SCHEDULED: 'SCHEDULED',
    RUNNING: 'RUNNING',
    PROCESSED: 'PROCESSED',
    CORRUPTED: 'CORRUPTED',
    CANCELLED: 'CANCELLED'
};

export const BOOKING_ACTION_TYPE = {
    RESTART_JOB: 'RESTART_JOB',
    TURN_ON_DATA: 'TURN_ON_DATA',
    SWITCH_VISUAL_PATH: 'SWITCH_VISUAL_PATH',
    GET_AVID_WORKSPACES: 'GET_AVID_WORKSPACES',
    TOGGLE_AVID_WORKSPACE: 'TOGGLE_AVID_WORKSPACE'
};

export const BOOKING_TYPE = {
    LIVE_STREAM: 'Live Stream',
    SDN: 'SDN',
    EVS: 'EVS',
    QUANTEL: 'Quantel',
    EVS_AND_QUANTEL: 'EVS + Quantel',
    ROUTER_SWITCH_ONLY: 'Router Switch Only'
};

export const DATE_FORMAT = {
    INTERACTIVE: 'DD/MM/YYYY hh:mm:ss A',
    AUTO: 'DD/MM/YYYY hh:mm:ss a', // TODO: can be different from interactive
    DAY_NUM: 'D',
    DAY: 'dddd',
    MONTH: 'MMMM',
    TIME: 'HH:mm:ss',
    DATE: 'YYYY-MM-DD'
};

export const DATE_PERIOD = {
    TODAY: 'TODAY',
    LAST_WEEK: 'LAST WEEK',
    LAST_MONTH: 'LAST MONTH',
    CUSTOM_RANGE: 'CUSTOM RANGE'
};

export const DASHBOARD_TYPE = {
    INTERACTIVE: 'interactive',
    AUTO: 'auto'
};

export const FILTER_TYPE = {
    DATE: 'DATE',
    STATUS: 'STATUS',
    FREQ: 'FREQ',
    WORK_ORDER_NUMBER: 'WORK_ORDER_NUMBER'
};

export const JOB_TYPE = {
    ROUTER_SWITCH: 'Router Switch',
    CLIP: 'Clip',
    WO_STATUS_UPDATE: 'WO Status Update',
    LIVE_STREAM: 'Live Stream',
    SDN: 'SDN'
};

export const JOB_STATUS = {
    RUNNING: 'RUNNING',
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

export const JOB_TARGET_TYPE = {
    EVS: 'EVS',
    AVID: 'Avid',
    ARDOME: 'Ardome',
    NONE: 'None',
    EVS_AVID: 'EVS++Avid',
    EVS_ARDOME: 'EVS++Ardome',
    AVID_ARDOME: 'Avid++Ardome',
    EVS_AVID_ARDOME:  'EVS++Avid++Ardome'
};

export const KEY_CODE = {
    ENTER: 13
};

export const RCG_HOST = 'fsasydrcg.foxsports.com.au';

export const RCG_BASE_URL = `http://${RCG_HOST}/rcg/rest`;

export const SECOND_MS = 1000;

export const SORT_OPTIONS = { // For future use
    WO_NUMBER: 'WO#',
    NAME: 'NAME',
    PATH: 'PATH',
    TYPE: 'TYPE',
    STATUS: 'STATUS',
    START_TIME: 'START TIME',
    END_TIME: 'END TIME'
};

export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC'
};

export const STATIC_ATTR_VALUE = {
    TBA: 'TBA',
    YES: 'Yes',
    NO: 'No',
    NONE: 'None',
    TRUE: 'True',
    FALSE: 'False',
    ELEMENTAL: 'Elemental'
};

export const SWITCH_RESULT_STATUS = {
    SWITCH_SUCCESS: 'SWITCH_SUCCESS',
    SWITCH_FAILED: 'SWITCH_FAILED',
    SWITCH_IGNORED: 'SWITCH_IGNORED'
};
