import React, { Component } from 'react';
import AlertedIncidentCard from '../../components/AlertedIncidentCard';

class AlertedIncidentList extends Component {
  constructor(props) {
    super(props);
    this.state = { incidents: [] };
  }

  //TODO - Make ajax call to fetch escalated incidents

  render() {
    return (
      <div>
        {this.state.incidents.map(incident => (
          <AlertedIncidentCard incident={incident} />
        ))}
      </div>
    );
  }
}

export default AlertedIncidentList;
