import React from 'react';
import get from 'lodash/get';

import Logo from '../logo';
import Switch from '../switch';

import {DASHBOARD_TYPE, FILTER_TYPE} from '../../utils/constants';

export default class InteractiveHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            woNumField: ''
        };
    }

    handleGetSearchWoNumber(e) {
        this.setState({woNumField: e.target.value});
    }

    handleSearchButton() {
        this.props.onFilterUpdate(FILTER_TYPE.WORK_ORDER_NUMBER, this.state.woNumField);
        this.props.onShowFullView();
    }

    clearInput() {
        this.setState({woNumField: ''});
    }

    renderAvidWorkspace() {
        return this.props.avidWorkspaces.map((workspace) => {
            const isLoading = this.props.bookingActionLoadingId === workspace.name;
            let checkedByToggle;

            if (get(this.props.bookingActionResponse, 'id', null) === workspace.name) {
                checkedByToggle = get(this.props.bookingActionResponse, 'payload.result.enabled');
            }

            return (
                <Switch
                    key={workspace.name}
                    id={workspace.name}
                    isLoading={isLoading}
                    checkboxLabel={workspace.name}
                    checkedLabel="ON"
                    uncheckedLabel="OFF"
                    checked={(checkedByToggle === undefined) ? workspace.enabled : checkedByToggle}
                    onToggleSwitch={this.props.onBookingActionRequest} />
            );
        });
    }

    render() {
        return (
            <header className="rcg-interactive-header">
                <div className="rcg-interactive-header__logo">
                    <Logo
                        title="RCG Departure Tracker"
                        indicator={DASHBOARD_TYPE.INTERACTIVE} />
                </div>
                <div className="rcg-interactive-header__search">
                    <fieldset className="rcg-interactive-header__search-set">
                        <div className="rcg-interactive-header__search-bar">
                            <label className="rcg-interactive-header__search-label">Search WO#</label>
                            <div className="rcg-interactive-header__search-drop">
                                <input
                                    className="rcg-interactive-header__search-input"
                                    type="number"
                                    placeholder="Enter Complete WO#"
                                    onKeyPress={this.props.onEnter}
                                    value={this.state.woNumField}
                                    onChange={this.handleGetSearchWoNumber.bind(this)} />
                                <button
                                    className="rcg-interactive-header__search-button"
                                    onClick={this.handleSearchButton.bind(this)}>
                                    <i className="fa fa-search" />
                                </button>
                            </div>
                        </div>
                        <div className="rcg-interactive-header__search-clear">
                            <button
                                className="rcg-interactive-header__search-clear-button"
                                onClick={this.clearInput.bind(this)}>
                                CLEAR
                            </button>
                        </div>
                    </fieldset>
                </div>
                <div className="rcg-interactive-header__auto-refresh">
                    <form>
                        <fieldset className="rcg-interactive-header__auto-refresh-set">
                            <label className="rcg-interactive-header__auto-refresh-label">Auto-Refresh</label>
                            <div className="rcg-interactive-header__auto-refresh-drop">
                                <select
                                    className="rcg-interactive-header__auto-refresh-options"
                                    placeholder="Select"
                                    onChange={this.props.onRefresh}>
                                    <option key="0" value={0}>None</option>
                                    <option key="1" value={10}>10 Seconds</option>
                                    <option key="2" value={30}>30 Seconds</option>
                                    <option key="3" value={60}>1 Minute</option>
                                    <option key="4" value={300}>5 Minutes</option>
                                </select>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div className="rcg-interactive-header__avid">
                    <div className="rcg-interactive-header__avid-title">
                        Avid Workspaces
                    </div>
                    <div className="rcg-interactive-header__avid-settings">
                        {this.renderAvidWorkspace()}
                    </div>
                </div>
            </header>
        );
    }
}

InteractiveHeader.propTypes = {
    avidWorkspaces: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string,
        name: React.PropTypes.string,
        enabled: React.PropTypes.bool
    })),
    onRefresh: React.PropTypes.func,
    onEnter: React.PropTypes.func,
    onFilterUpdate: React.PropTypes.func,
    onShowFullView: React.PropTypes.func,
    onBookingActionRequest: React.PropTypes.func,
    bookingActionLoadingId: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    bookingActionResponse: React.PropTypes.shape({
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        payload: React.PropTypes.shape({
            status: React.PropTypes.number,
            message: React.PropTypes.string
        })
    })
};
