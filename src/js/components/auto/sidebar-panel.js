import React from 'react';

export default class AutoSidebarPanel extends React.PureComponent {
    render() {
        return (
            <aside className="rcg-auto-sidebar-panel">
                {this.props.header && <div className="rcg-auto-sidebar-panel__header"> {this.props.header} </div>}
                {this.props.children}
            </aside>
        );
    }
}

AutoSidebarPanel.defaultProps = {};

AutoSidebarPanel.propTypes = {
    header: React.PropTypes.string,
    children: React.PropTypes.element
};
