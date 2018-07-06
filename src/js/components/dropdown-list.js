import React from 'react';
import capitalize from 'lodash/capitalize';

export default class DropdownList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected
        };
    }

    componentWillReceiveProps(props) {
        this.setState({selected: props.selected});
    }

    render() {
        const option = Object.keys(this.props.options).map((key, index) => {
            return (<option key={index} value={this.props.options[key]}>{capitalize(this.props.options[key])}</option>);
        });

        return (
            <select
                className={this.props.classNames}
                value={this.state.selected}
                onChange={this.props.onChangeValue}>
                {option}
            </select>
        );
    }
}

DropdownList.defaultProps = {};

DropdownList.propTypes = {
    options: React.PropTypes.shape({
        option: React.PropTypes.string
    }),
    selected: React.PropTypes.string,
    classNames: React.PropTypes.string,
    onChangeValue: React.PropTypes.func
};
