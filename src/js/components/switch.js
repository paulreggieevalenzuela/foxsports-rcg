import React from 'react';
import classnames from 'classnames';
import noop from 'lodash/noop';

import {BOOKING_ACTION_TYPE} from '../utils/constants';

export default class Switch extends React.PureComponent {
    handleChange() {
        this.props.onToggleSwitch({
            bookingId: this.props.id,
            type: BOOKING_ACTION_TYPE.TOGGLE_AVID_WORKSPACE
        });
    }

    render() {
        const toggleClass = classnames(
            'rcg-switch__label-text',
            {'rcg-switch__label-text--checked': this.props.checked}
        );

        const loadingIconClass = classnames(
            'rcg-switch__loading-icon',
            {'fa fa-spinner fa-spin': this.props.isLoading}
        );

        const label = <span className={toggleClass}>{(this.props.checked) ? this.props.checkedLabel : this.props.uncheckedLabel}</span>;

        return (
            <div className="rcg-switch">
                <label className="rcg-switch__label">{this.props.checkboxLabel}</label>
                <input
                    id={this.props.id}
                    className="rcg-switch__toggle rcg-switch__toggle--round"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.handleChange.bind(this)} />
                <label htmlFor={this.props.id} className="rcg-switch__label">
                    {label}
                </label>
                <i className={loadingIconClass} />
            </div>
        );
    }
}

Switch.defaultProps = {
    checked: false,
    isLoading: false,
    onToggleSwitch: noop
};

Switch.propTypes = {
    id: React.PropTypes.string,
    checkboxLabel: React.PropTypes.string,
    uncheckedLabel: React.PropTypes.string,
    checkedLabel: React.PropTypes.string,
    checked: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
    onToggleSwitch: React.PropTypes.func
};
