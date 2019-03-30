import React, { Component } from 'react';
import AlertedIncidentCard from '../AlertedIncidentCard';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import s from './AlertedIncidentList.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class AlertedIncidentList extends Component {
  constructor(props) {
    super(props);
    this.state = { incidents: [] };
  }

  //TODO - Make ajax call to fetch escalated incidents
  componentWillMount() {
    this.fetchEscalatedIncident();
  }

  fetchEscalatedIncident() {
    fetch(API_HOST + 'api/incident/get_escalated', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => this.setState({ incidents: data.reverse() }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className={s.list}>
        {this.state.incidents.map(incident => (
          <AlertedIncidentCard incident={incident} />
        ))}
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentList);
