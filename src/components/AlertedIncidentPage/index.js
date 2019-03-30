import React, { Component } from 'react';
import AlertedIncidentList from './AlertedIncidentList';

class AlertedIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 0 };
  }

  render() {
    return <AlertedIncidentList />;
  }
}

export default AlertedIncidentPage;
