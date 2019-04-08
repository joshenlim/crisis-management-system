import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HqDashboard.scss';

import TimeWeatherTemp from '../../components/TimeWeatherTemp';

import iconArchived from '../../assets/images/hqicon-archived.svg';
import iconReport from '../../assets/images/hqicon-reports.svg';
import iconStatistics from '../../assets/images/hqicon-statistics.svg';

import AlertedIncidentPage from '../../components/AlertedIncidentPage';
import ArchivedIncidentPage from '../../components/ArchivedIncidentPage';

import { SOCKIO_HOST, API_HOST } from '../../constants';
import Enum from '../../constants/enum';

import Socket from 'socket.io-client';
import StatisticVisualPage from '../../components/StatisticVisualPage';

var io = Socket(SOCKIO_HOST);

class HqDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      escalatedIncidents: this.props.escalatedIncidents,
      archivedIncidents: this.props.archivedIncidents,
    };

    this.changeTab = this.changeTab.bind(this);
    this.render = this.render.bind(this);
  }

  componentWillMount() {
    io.on('fetch', type => {
      if (Enum.socketEvents.ESCALATE_INCIDENT == type) {
        this.listRefresh();
        console.log(
          'SocketIo: received "escalate incident" at ' +
            new Date().getTime() +
            'ms',
        );
      }
    });
  }

  listRefresh = () => {
    fetch(API_HOST + 'api/incident/get_escalated')
      .then(res => res.json())
      .then(data => data.reverse())
      .then(data => this.setState({ escalatedIncident: data }));

    fetch(API_HOST + 'api/incident/get_escalated_archived')
      .then(res => res.json())
      .then(data => data.reverse())
      .then(data => this.setState({ archivedIncidents: data }));
  };

  changeTab(e) {
    this.setState({ activeTab: e.target.name });

    let icons = document.getElementsByClassName(s.tabIcons);
  }

  renderTab() {
    if (this.state.activeTab == 0) {
      return (
        <AlertedIncidentPage
          escalatedIncidents={this.state.escalatedIncidents}
        />
      );
    } else if (this.state.activeTab == 1) {
      return <StatisticVisualPage />;
    } else if (this.state.activeTab == 2) {
      return (
        <ArchivedIncidentPage
          escalatedIncidents={this.state.archivedIncidents}
        />
      );
    }
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.sideColumn}>
          <img
            style={this.state.activeTab == 0 ? { opacity: 1 } : {}}
            className={s.tabIcons}
            onClick={this.changeTab}
            alt="Archived"
            name="0"
            src={iconArchived}
          />
          <br />
          <img
            style={this.state.activeTab == 1 ? { opacity: 1 } : {}}
            className={s.tabIcons}
            onClick={this.changeTab}
            alt="Statistics"
            name="1"
            src={iconStatistics}
          />
          <br />
          <img
            style={this.state.activeTab == 2 ? { opacity: 1 } : {}}
            className={s.tabIcons}
            onClick={this.changeTab}
            alt="Reports"
            name="2"
            src={iconReport}
          />
        </div>
        <div className={s.main}>
          <TimeWeatherTemp />
          {this.renderTab()}
        </div>
        <div className={s.sideColumn} />
      </div>
    );
  }
}

export default withStyles(s)(HqDashboard);
