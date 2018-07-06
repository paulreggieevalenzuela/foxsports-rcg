import React from 'react';

import Fsvg from '@fsa/fsui/src/components/fsvg/fsvg';

export default class Logo extends React.PureComponent {
    render() {
        return (
            <div className={`rcg-logo-${this.props.indicator}`}>
                <div className={`rcg-logo__svg-${this.props.indicator}`}>
                    <Fsvg name="logo-fs-generic" />
                    <div className={`rcg-logo__title-${this.props.indicator}`}>
                        {this.props.title}
                    </div>
                </div>
            </div>
        );
    }
}

Logo.defaultProps = {};

Logo.propTypes = {
    indicator: React.PropTypes.string,
    title: React.PropTypes.string
};
