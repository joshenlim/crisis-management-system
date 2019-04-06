import React, { Component } from 'react';
import AlertedIncidentCard from '../AlertedIncidentCard';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import s from './AlertedIncidentList.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { SOCKIO_HOST } from '../../../constants';
import Socket from 'socket.io-client';

var io = Socket(SOCKIO_HOST);

class AlertedIncidentList extends Component {
  constructor(props) {
    super(props);
    this.state = { incidents: [] };
  }

  //TODO - Emit socket event on escalate incident
  componentWillMount() {
    io.on('fetch', type => {
      if (Enum.socketEvents.ESCALATE_INCIDENT == type) {
        this.fetchEscalatedIncident();
        console.log(
          'SocketIo: received "escalate incident" at ' +
            new Date().getTime() +
            'ms',
        );
      }
    });
  }

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
          <AlertedIncidentCard
            displayDetail={this.props.displayDetail}
            incident={incident}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentList);
