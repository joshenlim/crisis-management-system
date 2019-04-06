import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertedIncidentDetail.scss';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import DispatchVehicleList from '../DispatchVehicleList';

import backBtn from '../../../assets/images/back.svg';
import IncidentDetailMap from './IncidentDetailMap/IncidentDetailMap';
import formatUtils from '../../../formatUtils';
import Enum from '../../../constants/enum';

class AlertedIncidentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { incident: {}, dispatchedUnits: [] };

    this.resolveCase = this.resolveCase.bind(this);
  }

  componentWillMount() {
    this.fetchIncident();
    this.fetchDispatchUnit();
  }

  resolveCase() {
    if (
      confirm(
        "You are about to set this incident as 'RESOLVED'. " +
          '\nAre you sure you want to continue?',
      )
    ) {
      fetch(API_HOST + 'api/incident/update_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident_id: this.props.incidentId,
          status: Enum.incidentStatus.RESOLVED,
        }),
      })
        .then(() => {
          alert('Incident successfully resolved!');
          this.props.displayList();
        })
        .catch(err => console.log(err));
    }
  }

  fetchDispatchUnit() {
    fetch(
      API_HOST +
        'api/station/get_dispatched_vehicles?incident_id=' +
        this.props.incidentId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => this.setState({ dispatchedUnits: data }))
      .catch(err => console.log(err));
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
    const { incident } = this.state;

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

    return Object.keys(incident).length != 0 && (
      <div className={s.content}>
        <div className={s.leftCol}>
          <div className={s.back} onClick={this.props.displayList}>
            <img width="8" src={backBtn} />
            <span className={s.backText}>Back</span>
          </div>
          <hr />

          <div className={s.header}>
            {formatUtils.formatCategoryName(incident.category)} - {incident.address}, {incident.postal_code}
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
          <IncidentDetailMap
            address={incident.postal_code}
            center={{ lat: incident.lat, lng: incident.lng }}
            zoom={12}
          />
          <div className={s.header2}>Incident Details</div>
          <p>
            Create At: {incident.created_at}
            <br />
            Incident Location: {incident.address}, {incident.postal_code}
            <br />
            Caller Information: {incident.caller}, {incident.caller_contact}
          </p>
          <div className={s.header2}>Dispatch Details</div>
          <table>
            <tbody>
              {this.state.dispatchedUnits.map(unit => {
                return (
                  <tr>
                    <td>{unit.call_sign} - </td>
                    <td>{unit.type}</td>&emsp;
                    <td>{unit.veh_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />

          <div className={s.buttonPanel}>
            <div className={s.resolveBtn} onClick={this.resolveCase}>
              Mark Case as Resolved
            </div>
          </div>
        </div>

        <div className={s.rightCol}>
          <DispatchVehicleList {...this.props} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentDetail);
