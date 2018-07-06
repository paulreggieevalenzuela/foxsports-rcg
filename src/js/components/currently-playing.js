import React from 'react';

export default class CurrentlyPlaying extends React.PureComponent {
    render() {
        return (
            <div className="rcg-currently-playing__logo">
                <div className="rcg-currently-playing__logo-image">
                    <p><a><img alt="Currently Playing" src={this.props.teamAImg} /></a></p>
                    <p><a><img alt="Currently Playing" src={this.props.teamBImg} /></a></p>
                </div>
                <div className="rcg-currently-playing__team">
                    <p className="rcg-currently-playing__team-home">{this.props.teamA}</p>
                    <p className="rcg-currently-playing__team-vs">vs</p>
                    <p className="rcg-currently-playing__team-away">{this.props.teamB}</p>
                </div>
            </div>
        );
    }
}

CurrentlyPlaying.defaultProps = {};

CurrentlyPlaying.propTypes = {
    teamA: React.PropTypes.string,
    teamB: React.PropTypes.string,
    teamAImg: React.PropTypes.string,
    teamBImg: React.PropTypes.string
};
