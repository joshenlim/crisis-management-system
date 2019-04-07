import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PmoDashboard.scss';

import iconArchived from '../../assets/images/hqicon-archived.svg';
import iconReport from '../../assets/images/report.svg';

import AlertedIncidentPage from '../../components/AlertedIncidentPage';
import StatisticVisualPage from '../../components/StatisticVisualPage';
import TimeWeatherTemp from '../../components/TimeWeatherTemp';
import BroadcastModal from '../../components/BroadcastModal';

import { SOCKIO_HOST } from '../../constants';
import Socket from 'socket.io-client';

var io = Socket(SOCKIO_HOST);

class PmoDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      detailModalType: '',
      showDetailsModal: false,
    };
  }

  mountModal = (type) => {
    console.log("Mount:", type)
    this.setState({
      detailModalType: type,
      showDetailsModal: !this.state.showDetailsModal,
    });
  };

  changeTab = (e) => {
    this.setState({ activeTab: e.target.name });
    let icons = document.getElementsByClassName(s.tabIcons);
  }

  renderTab = () => {
    if (this.state.activeTab == 0) {
      return <AlertedIncidentPage
        escalatedIncidents={this.props.escalatedIncidents}
        mountModal={this.mountModal}
      />;
    } else if (this.state.activeTab == 1) {
      return <StatisticVisualPage />;
    }
  }

  render() {
    const { showDetailsModal, detailModalType } = this.state;
    return (
      <div className={s.container}>
        {
          showDetailsModal && <BroadcastModal type={detailModalType} mountModal={this.mountModal} />
        }
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
