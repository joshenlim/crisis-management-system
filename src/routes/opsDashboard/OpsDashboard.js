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

import { SOCKIO_HOST } from '../../constants';

import Socket from 'socket.io-client';
var io = Socket(SOCKIO_HOST);

class OpsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mockIncident: {},
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
  }
  
  componentWillMount() {
    io.on('fetch', type => {
      if (Enum.socketEvents.NEW_INCIDENT == type) {
        //TODO - Perform AJAX to poll for list of ongoing incident to update incident card
        console.log(
          'Placeholder Action in OpsDashboard: Refresh incident list',
        );
      }
    });

    this.state.mockIncident = {
      id: 'SNB-1045-367X',
      category: 'Emergency Ambulance',
      postalCode: 'S820193',
      address: '#01-231',
      status: 'DISPATCHED',
      description:
        'Traffic accident involving 3 vehicles on the Pan-Island Expressway (PIE) 2 injured but no fatality, consectetur adipiscing elit. Suspendisse metus ipsum, feugiat id nisi non, laoreet facilisis nunc. Cras et pellentesque est, a pulvinar turpis. Quisque laoreet tellus nulla, sit amet varius mauris porta sodales.',
    };
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
        <CreateNewIncidentModal mountModal={this.mountCreateNewIncidentModal} fireStationList={this.props.fireStationList} />
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
          <IncidentCard
            incident={this.state.mockIncident}
            mountModal={this.mountModal}
          />
          <IncidentCard
            incident={this.state.mockIncident}
            mountModal={this.mountModal}
          />
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
