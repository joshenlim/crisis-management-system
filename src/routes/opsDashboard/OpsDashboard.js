import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpsDashboard.scss';
import addIcon from '../../assets/images/plus.svg';
import mapIcon from '../../assets/images/map.svg';
import archivedIcon from '../../assets/images/archived.svg';

import Map from '../../components/Map';
import ArchivedIncidents from '../../components/ArchivedIncidents';
import TimeWeatherTemp from '../../components/TimeWeatherTemp';
import IncidentCard from '../../components/IncidentCard';
import ViewDetailsModal from '../../components/ViewDetailsModal';
import Enum from '../../constants/enum';
import CreateNewIncidentModal from '../../components/CreateNewIncidentModal';
import fetch from 'node-fetch';

import { SOCKIO_HOST, API_HOST } from '../../constants';

import Socket from 'socket.io-client';
var io = Socket(SOCKIO_HOST);

class OpsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      incidents: this.props.ongoingIncidentList,
      showDetailsModal: false,
      detailModalId: '',
      detailModalType: Enum.detailType.INCIDENT,
      showCreateNewIncidentModal: false,
    };
  }

  componentWillMount() {
    io.on('fetch', type => {
      if (Enum.socketEvents.NEW_INCIDENT == type) {
        this.fetchOngoingIncident();
      }
    });
  }

  changeTab = (e) => {
    this.setState({
      activeTab: e.target.name
    });
  }

  fetchOngoingIncident = () => {
    fetch(API_HOST + 'api/incident/get_ongoing', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => this.setState({ incidents: data.reverse() }))
      .catch(err => console.log(err));
  }

  mountModal = (type, id) => {
    this.setState({
      detailModalType: type,
      detailModalId: id,
      showDetailsModal: !this.state.showDetailsModal,
    });
  };

  handleOnKeyDown = (event) => {
    event.preventDefault();
  };

  mountCreateNewIncidentModal = () => {
    this.setState({
      showCreateNewIncidentModal: !this.state.showCreateNewIncidentModal,
    });
  };

  renderModal() {
    if (this.state.showDetailsModal) {
      return (
        <ViewDetailsModal
          id={this.state.detailModalId}
          type={this.state.detailModalType}
          mountModal={this.mountModal}
        />
      );
    }
  }

  renderCreateNewIncidentModal = () => {
    if (this.state.showCreateNewIncidentModal) {
      return (
        <CreateNewIncidentModal
          mountModal={this.mountCreateNewIncidentModal}
          fireStationList={this.props.fireStationList}
          publicHospitalList={this.props.publicHospitalList}
          privateHospitalList={this.props.privateHospitalList}
          ongoingIncidentList={this.props.ongoingIncidentList}
        />
      );
    }
  }

  render() {
    return (
      <div className={s.container}>
        {this.renderModal()}
        {this.renderCreateNewIncidentModal()}
        <div className={s.sideColumn}>
          <TimeWeatherTemp />
          <p className={s.columnTitle}>Ongoing Incidents</p>
          <div className={s.incidentList}>
            {
              this.state.incidents.length > 0 && this.state.incidents.map(incidents => (
                <IncidentCard incident={incident} mountModal={this.mountModal} />
              ))
            }
            {
              this.state.incidents.length == 0 && <p className={s.noIncidents}>There are currently no<br/>ongoing incidents</p>
            }
          </div>
        </div>
        <div className={s.main}>
          <div className={s.nav + " " + (this.state.activeScreen == "map" ? s.activeMap : s.active)}>
            <img
              className={s.navBtn}
              style={this.state.activeTab == 0 ? { opacity: 1 } : {}}
              src={mapIcon}
              alt="mapIcon"
              name={0}
              onClick={this.changeTab}
            />
            <img
              className={s.navBtn}
              style={this.state.activeTab == 1 ? { opacity: 1 } : {}}
              src={archivedIcon}
              alt="archivedIcon"
              name={1}
              onClick={this.changeTab}
            />
          </div>
          { 
            this.state.activeTab == 0 && <Map
              mountModal={this.mountModal}
              fireStationList={this.props.fireStationList}
              publicHospitalList={this.props.publicHospitalList}
              privateHospitalList={this.props.privateHospitalList}
              ongoingIncidentList={this.props.ongoingIncidentList}
            />
          }
          { this.state.activeTab == 1 && <ArchivedIncidents /> }
        </div>
        <div className={s.sideColumn} style={{ marginTop: '70px' }}>
          <div
            className={s.createIncidentBtn}
            onClick={this.mountCreateNewIncidentModal}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}
          >
            <img src={addIcon} alt="add-icon" />
            Create Incident
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(OpsDashboard);
