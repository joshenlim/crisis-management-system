import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpsDashboard.scss';
import addIcon from '../../assets/images/plus.svg';

import Map from '../../components/Map';
import NavBar from '../../components/NavBar';
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
      incidents: [],
      showDetailsModal: false,
      detailModalId: '',
      detailModalType: Enum.detailType.INCIDENT,
      showCreateNewIncidentModal: false,
    };

    this.mountModal = this.mountModal.bind(this);
    this.mountCreateNewIncidentModal = this.mountCreateNewIncidentModal.bind(
      this,
    );
    this.renderCreateNewIncidentModal = this.renderCreateNewIncidentModal.bind(
      this,
    );
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.fetchOngoingIncident = this.fetchOngoingIncident.bind(this);
  }

  componentWillMount() {
    this.fetchOngoingIncident();
    io.on('fetch', type => {
      if (Enum.socketEvents.NEW_INCIDENT == type) {
        this.fetchOngoingIncident();
      }
    });
  }

  fetchOngoingIncident() {
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

  handleOnKeyDown = event => {
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

  renderCreateNewIncidentModal() {
    if (this.state.showCreateNewIncidentModal) {
      return (
        <CreateNewIncidentModal
          mountModal={this.mountCreateNewIncidentModal}
          fireStationList={this.props.fireStationList}
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
          <p className={s.columnTitle}>Ongoing Incidents</p>
          <div className={s.incidentList}>
            {this.state.incidents.map(incident => (
              <IncidentCard incident={incident} mountModal={this.mountModal} />
            ))}
          </div>
        </div>
        <div className={s.main}>
          <NavBar />
          <Map mountModal={this.mountModal} />
        </div>
        <div className={s.sideColumn}>
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
