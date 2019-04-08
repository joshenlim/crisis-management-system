import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PmoDashboard.scss';

import iconArchived from '../../assets/images/hqicon-archived.svg';
import iconReport from '../../assets/images/report.svg';

import AlertedIncidentPage from '../../components/AlertedIncidentPage';
import StatisticVisualPage from '../../components/StatisticVisualPage';
import TimeWeatherTemp from '../../components/TimeWeatherTemp';
import BroadcastModal from '../../components/BroadcastModal';

import { SOCKIO_HOST, API_HOST } from '../../constants';
import Socket from 'socket.io-client';

import Enum from '../../constants/enum';

var io = Socket(SOCKIO_HOST);

class PmoDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      detailModalType: '',
      showDetailsModal: false,
      selectedIncident: {},
      escalatedIncidents: this.props.escalatedIncidents,
      archivedIncidents: this.props.archivedIncidents,
    };
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

  mountModal = (type, incident) => {
    this.setState({
      detailModalType: type,
      showDetailsModal: !this.state.showDetailsModal,
      selectedIncident: incident,
    });
  };

  changeTab = e => {
    this.setState({ activeTab: e.target.name });
    let icons = document.getElementsByClassName(s.tabIcons);
  };

  renderTab = () => {
    if (this.state.activeTab == 0) {
      return (
        <AlertedIncidentPage
          escalatedIncidents={this.props.escalatedIncidents}
          mountModal={this.mountModal}
        />
      );
    } else if (this.state.activeTab == 1) {
      return <StatisticVisualPage />;
    }
  };

  render() {
    const { showDetailsModal, detailModalType, selectedIncident } = this.state;
    return (
      <div className={s.container}>
        {showDetailsModal && (
          <BroadcastModal
            type={detailModalType}
            mountModal={this.mountModal}
            incident={selectedIncident}
          />
        )}
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
            alt="Report"
            name="1"
            src={iconReport}
          />
          <br />
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

export default withStyles(s)(PmoDashboard);
