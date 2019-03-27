import React, { Component } from 'react';
import s from './AlertedIncidentCard.scss';

class AlertedIncidentCard extends Component {
  constructor(props) {
    super(props);
    this.state = { incident: {} };
  }
  render() {
    return (
      <div className={s.incidentCard}>
        <div className={s.segment}>
          <p className={s.caseNo}>Case No: {incident.id}</p>
          <div
            className={s.expandBtn}
            onClick={this.expandIncident}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}
            incidentid={incident.id}
          >
            <img src={expandIcon} alt="expand" />
          </div>
        </div>
        <p className={s.category}>{incident.category}</p>
        <p className={s.location}>
          {incident.postal_code}, {incident.address}
        </p>
        <div className={`${s.status} ${statusClass}`}>{incident.status}</div>
      </div>
    );
  }
}

export default AlertedIncidentCard;
