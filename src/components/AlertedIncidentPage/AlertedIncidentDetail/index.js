import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertedIncidentDetail.scss';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import backBtn from '../../../assets/images/back.svg';

class AlertedIncidentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { incident: {} };

    this.resolveCase = this.resolveCase.bind(this);
  }

  componentWillMount() {
    this.fetchIncident();
  }

  resolveCase() {
    if (
      confirm(
        "You are about to set this incident as 'RESOLVED'. " +
          '\nAre you sure you want to continue?',
      )
    ) {
      fetch(API_HOST + 'api/incident/update_resolved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergid: this.props.incidentId,
        }),
      })
        .then(() => {
          alert('Incident successfully resolved!');
          this.props.displayList();
        })
        .catch(err => console.log(err));
    }
  }

  fetchIncident() {
    fetch(
      API_HOST +
        'api/incident/get?id=' +
        this.props.incidentId +
        '&emergency=true',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => this.setState({ incident: data[0] }))
      .catch(err => console.log(err));
  }

  render() {
    const incident = this.state.incident;

    let statusClass;
    switch (incident.status) {
      case 'DISPATCHED':
        statusClass = s.dispatched;
        break;
      case 'ON-SITE':
        statusClass = s.onsite;
        break;
      case 'ENROUTE BACK':
        statusClass = s.enrouteBack;
        break;
      default:
        statusClass = s.dispatched;
    }

    return (
      <div className={s.content}>
        <div className={s.leftCol}>
          <div className={s.back} onClick={this.props.displayList}>
            <img width="8" src={backBtn} />
            <span className={s.backText}>Back</span>
          </div>
          <hr />

          <div className={s.header}>
            {incident.category} - {incident.address}, {incident.postal_code}
          </div>

          <div className={s.caseNumStatus}>
            <span className={s.caseNo}>Case No: {incident.id}</span>
            &emsp;&emsp;
            <div className={`${s.status} ${statusClass}`}>
              {incident.status}
            </div>
          </div>

          <br />

          <div className={s.header2}>Incident Description</div>
          <p>{incident.description}</p>
          <div className={s.header2}>Map Location</div>
          <p>//TODO - Reuse "Map" Component</p>
          <div className={s.header2}>Incident Details</div>
          <p>
            Create At: {incident.create_at}
            Incident Location: {incident.address}, {incident.postal_code}
            Caller Information: {incident.caller}, {incident.caller_contact}
          </p>
          <div className={s.header2}>Dispatch Details</div>
          <p>//TODO - Get dispatch details of incident</p>

          <hr />

          <div className={s.buttonPanel}>
            <div className={s.resolveBtn} onClick={this.resolveCase}>
              Mark Case as Resolved
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentDetail);
