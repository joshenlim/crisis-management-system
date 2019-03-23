import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpsDashboard.scss';
import addIcon from '../../assets/images/plus.svg';

import Map from '../../components/Map';
import NavBar from '../../components/NavBar';
import IncidentCard from '../../components/IncidentCard';
import IncidentDetailsModal from '../../components/IncidentDetailsModal';
import CreateNewIncidentModal from '../../components/CreateNewIncidentModal';

class OpsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mockIncident: {},
      showIncidentDetailModal: false,
      showCreateNewIncidentModal: false,
    };

    this.mountIncidentModal = this.mountIncidentModal.bind(this);
    this.renderIncidentDetailModal = this.renderIncidentDetailModal.bind(this);
    this.mountCreateNewIncidentModal = this.mountCreateNewIncidentModal.bind(this);
    this.renderCreateNewIncidentModal = this.renderCreateNewIncidentModal.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  componentWillMount() {
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

  handleOnKeyDown = event => {
    event.preventDefault();
  };

  mountIncidentModal = () => {
    this.setState({
      showIncidentDetailModal: !this.state.showIncidentDetailModal
    });
  };

  mountCreateNewIncidentModal = () => {
    this.setState({
      showCreateNewIncidentModal: !this.state.showCreateNewIncidentModal
    })
  }

  renderIncidentDetailModal() {
    if (this.state.showIncidentDetailModal) {
      return (
        <IncidentDetailsModal
          incident={this.state.mockIncident}
          mountModal={this.mountIncidentModal}
        />
      );
    }
  }

  renderCreateNewIncidentModal() {
    if (this.state.showCreateNewIncidentModal) {
      return (
        <CreateNewIncidentModal
          mountModal={this.mountCreateNewIncidentModal}
        />
      );
    }
  }

  render() {
    return (
      <div className={s.container}>
        {this.renderIncidentDetailModal()}
        {this.renderCreateNewIncidentModal()}
        <div className={s.sideColumn}>
          <p className={s.columnTitle}>Ongoing Incidents</p>
          <IncidentCard
            incident={this.state.mockIncident}
            mountModal={this.mountIncidentModal}
          />
          <IncidentCard
            incident={this.state.mockIncident}
            mountModal={this.mountIncidentModal}
          />
        </div>
        <div className={s.main}>
          <NavBar />
          <Map />
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
