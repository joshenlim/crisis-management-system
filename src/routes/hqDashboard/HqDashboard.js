import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HqDashboard.scss';

import NavBar from '../../components/NavBar';

import iconArchived from '../../assets/images/hqicon-archived.svg';
import iconReport from '../../assets/images/hqicon-reports.svg';
import iconStatistics from '../../assets/images/hqicon-statistics.svg';

import { SOCKIO_HOST } from '../../constants';

import Socket from 'socket.io-client';
var io = Socket(SOCKIO_HOST);

class HqDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(e) {
    this.setState({ activeTab: e.target.name });

    let icons = document.getElementsByClassName(s.tabIcons);
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
          <NavBar />
        </div>
        <div className={s.sideColumn} />
      </div>
    );
  }
}

export default withStyles(s)(HqDashboard);
