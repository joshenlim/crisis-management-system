import React, { Component } from 'react';
import AlertedIncidentPage from '../AlertedIncidentPage';

/*
This component is a dirty fix for tab switch not switching when incident detail is mounted
*/
class ArchivedIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <AlertedIncidentPage {...this.props} />;
  }
}

export default ArchivedIncidentPage;
