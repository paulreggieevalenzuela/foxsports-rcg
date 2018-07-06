import React from 'react';
// import Slider from 'react-slick';
import Carousel from 'nuka-carousel';

import AutoBookingList from './auto/bookings-list';
import AutoSidebarPanel from './auto/sidebar-panel';
import Clock from './clock';
import DateDetails from './date-details';
import Logo from './logo';
import CurrentlyPlaying from './currently-playing';
import ConnectionReminder from './connection-reminder';

import {DASHBOARD_TYPE} from '../utils/constants';

export default class Auto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            connectionStatus: 'online'
        };
    }

    componentDidMount() {
        // this.clearInterval = setInterval(() => {
        //     this.slider.slickNext();
        // }, 3000);
        window.addEventListener('online',  this.updateOnlineStatus.bind(this));
        window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    }

    componentWillUnmount() {
        // clearInterval(this.clearInterval);
        window.removeEventListener('online',  this.updateOnlineStatus.bind(this));
        window.removeEventListener('offline',  this.updateOnlineStatus.bind(this));
    }

    updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';

        this.setState({connectionStatus: status}, () => {
            if (status === 'offline') {
                setTimeout(() => { // Enough time to show the reminder component before reloading the page
                    location.reload();
                }, 3000);
            }
        });
    }

    renderBookingList() {
        return (
            this.props.bookings.map((booking, index) =>
                <div className="rcg-auto__slider-item" key={index}>
                    <AutoBookingList {...booking} />
                </div>
            )
        );
    }

    render() {
        // const settings = {
        //     arrows: false,
        //     dots: false,
        //     infinite: true,
        //     slidesToScroll: 1,
        //     vertical: true
        // };

        return (
            <div className="rcg-auto">
                <ConnectionReminder connectionStatus={this.state.connectionStatus} />
                <aside className="rcg-auto__sidebar">
                    <Logo
                        title="RCG Departure Tracker"
                        indicator={DASHBOARD_TYPE.AUTO} />
                    <DateDetails indicator={DASHBOARD_TYPE.AUTO} />
                    <Clock timezone="Australia/Sydney" label="SYD" subLabel="LOC TIME" indicator={DASHBOARD_TYPE.AUTO} />
                    <Clock timezone="UTC" label="UTC" subLabel="STD TIME" indicator={DASHBOARD_TYPE.AUTO} />
                    <AutoSidebarPanel header="Currently Playing">
                        <CurrentlyPlaying
                            teamA="Adelaide Crows"
                            teamB="Essendon Bombers"
                            teamAImg="http://i.imgur.com/hq1YKNt.png"
                            teamBImg="http://i.imgur.com/hq1YKNt.png" />
                    </AutoSidebarPanel>
                </aside>
                <main className="rcg-auto__main-container">
                    <header className="rcg-auto__bookings">
                        <ul>
                            <li className="rcg-auto__bookings-list-tracker" />
                            <li className="rcg-auto__bookings-list-time">Time</li>
                            <li className="rcg-auto__bookings-list-work-order" title="Work Order Number">WO#</li>
                            <li className="rcg-auto__bookings-list-sport">Sport</li>
                            <li className="rcg-auto__bookings-list-signal-path">Signal Path</li>
                            <li className="rcg-auto__bookings-list-comms" title="Comms">COMMS/CNF</li>
                            <li className="rcg-auto__bookings-list-return-path">Return Path</li>
                            <li className="rcg-auto__bookings-list-splits">Splits</li>
                        </ul>
                    </header>
                    <Carousel
                        autoplay={true}
                        vertical={true}
                        cellSpacing={20}
                        wrapAround={true}>
                        {this.renderBookingList()}
                        <div className="rcg-auto__slider-item">
                            <ul className="rcg-auto__end-marker">
                                <li>End of today's bookings.</li>
                            </ul>
                        </div>
                    </Carousel>
                    { /*
                    <Slider ref={(ref) => { this.slider = ref; }} {...settings}>
                        {this.renderBookingList()}
                        <div className="rcg-auto__slider-item">
                            <ul className="rcg-auto__end-marker">
                                <li>End of today's bookings.</li>
                            </ul>
                        </div>
                    </Slider>
                    */ }
                </main>

            </div>
        );
    }
}

Auto.defaultProps = {
    bookings: []
};

Auto.propTypes = {
    bookings: React.PropTypes.arrayOf(React.PropTypes.object)
};
