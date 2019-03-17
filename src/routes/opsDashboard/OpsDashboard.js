import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpsDashboard.scss';
import addIcon from '../../assets/images/plus.svg';

import Map from '../../components/Map';
import NavBar from '../../components/NavBar';
import IncidentCard from '../../components/IncidentCard';

class OpsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  handleClick = event => {
    console.log("click", event);
  }

  handleOnKeyDown = event => {
    event.preventDefault();
  }

  render() {
    const mockIncident = {
      id: "SNB-1045-367X",
      category: "Emergency Ambulance",
      postalCode: "S820193",
      address: "#01-231",
      status: "DISPATCHED"
    }

    return (
      <div className={s.container}>
        <div className={s.sideColumn}>
          <p className={s.columnTitle}>Ongoing Incidents</p>
          <IncidentCard incident={mockIncident} />
          <IncidentCard incident={mockIncident} />
        </div>
        <div className={s.main}>
          <NavBar />
          <Map />
        </div>
        <div className={s.sideColumn}>
          <div className={s.createIncidentBtn} 
            onClick={this.handleClick}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}>
            <img src={addIcon} alt="add-icon" />
            Create Incident
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(OpsDashboard);
