import React, { Component } from 'react';
import AlertedIncidentCard from '../AlertedIncidentCard';

import s from './AlertedIncidentList.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { SOCKIO_HOST } from '../../../constants';
import Socket from 'socket.io-client';
import Enum from '../../../constants/enum';

var io = Socket(SOCKIO_HOST);

class AlertedIncidentList extends Component {
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

  render() {
    const { escalatedIncidents } = this.props;
    if (escalatedIncidents.length > 0) {
      return (
        <div className={s.list}>
          {escalatedIncidents.map((incident, index) => (
            <AlertedIncidentCard
              key={index}
              displayDetail={this.props.displayDetail}
              incident={incident}
            />
          ))}
        </div>
      );
    } else {
      return <p className={s.tips}>There are currently no incidents.</p>;
    }
  }
}

export default withStyles(s)(AlertedIncidentList);
