import React from 'react';
import classnames from 'classnames';
import noop from 'lodash/noop';

import {SORT_ORDER} from '../utils/constants';

export default class SortIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortOrder: SORT_ORDER.DESC
        };
    }

    handleClick() {
        const newSortOrder = this.state.sortOrder === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.DESC;

        this.setState({sortOrder: newSortOrder});
        this.props.onSortUpdate(this.props.columnName, newSortOrder);
    }

    render() {
        const iconClassName = classnames(
            'fa',
            {'fa-sort': !this.props.selected},
            {'fa-sort-asc': (this.props.selected && this.state.sortOrder === SORT_ORDER.ASC)},
            {'fa-sort-desc': (this.props.selected && this.state.sortOrder === SORT_ORDER.DESC)}
        );

        return (
            <button className="rcg-sort-icon btn-link" onClick={this.handleClick.bind(this)}>
                <i className={iconClassName} aria-hidden="true" />
            </button>
        );
    }
}

SortIcon.defaultProps = {
    onSortUpdate: noop
};

SortIcon.propTypes = {
    onSortUpdate: React.PropTypes.func,
    selected: React.PropTypes.bool,
    columnName: React.PropTypes.string
};
