import React from 'react';
import classnames from 'classnames';

export default class ConnectionReminder extends React.PureComponent {
    render() {
        const showReminder = classnames(
            'rcg-connection-reminder',
            {'rcg-connection-reminder--show': (this.props.connectionStatus === 'offline')}
        );

        return (
            <div className={showReminder}>
                <label
                    className="rcg-connection-reminder__label">
                    Your device has lost its internet connection, <br />
                    Attempting to reconnect...
                    <i className="fa fa-circle-o-notch fa-spin fa-fw" />
                </label>
            </div>
        );
    }
}

ConnectionReminder.propTypes = {
    connectionStatus: React.PropTypes.string
};
