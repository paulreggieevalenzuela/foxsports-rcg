import React from 'react';

export default class ResultLoader extends React.PureComponent {
    render() {
        const icon = this.props.spinner ? 'fa-spinner fa-pulse' : 'fa-frown-o';

        // `fa` classnames is from font-awesome library
        return (
            <div className="rcg-result-loader">
                <i className={`fa ${icon} fa-3x fa-fw`} />
                <span className="rcg-result-loader__message">
                    {this.props.message}
                </span>
            </div>
        );
    }
}

ResultLoader.defaultProps = {
    message: '',
    spinner: false
};

ResultLoader.propTypes = {
    spinner: React.PropTypes.bool,
    message: React.PropTypes.string
};
