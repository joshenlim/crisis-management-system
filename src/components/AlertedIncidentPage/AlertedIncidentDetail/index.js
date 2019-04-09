import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertedIncidentDetail.scss';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import DispatchVehicleList from '../DispatchVehicleList';

import backBtn from '../../../assets/images/back.svg';
import IncidentDetailMap from './IncidentDetailMap/IncidentDetailMap';
import formatUtils from '../../../formatUtils';
import Enum from '../../../constants/enum';
import AlertedIncidentDesc from '../AlertedIncidentDesc';
import SubmitReportPanel from '../SubmitReportPanel';

import { SOCKIO_HOST } from '../../../constants';
import Socket from 'socket.io-client';

import smsIcon from '../../../assets/images/sms.svg';
import emailIcon from '../../../assets/images/email.svg';
import socialIcon from '../../../assets/images/social.svg';

var io = Socket(SOCKIO_HOST);

@connect(state => ({
  user: state.user,
}))
class AlertedIncidentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { incident: {}, dispatchedUnits: [] };
  }

  componentWillMount() {
    this.fetchIncident();
    this.fetchDispatchUnit();

    io.on('fetch', type => {
      if (Enum.socketEvents.INCIDENT_DETAIL == type) {
        this.fetchIncident();
        this.fetchDispatchUnit();
        console.log(
          'SocketIo: received "incident detail" at ' +
            new Date().getTime() +
            'ms',
        );
      }
    });
  }

  resolveCase = () => {
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
          io.emit('notify', Enum.socketEvents.INCIDENT_DETAIL);
          console.log(
            'SocketIo: emitted "incident detail" at ' +
              new Date().getTime() +
              'ms',
          );

          alert('Incident successfully resolved!');
        })
        .catch(err => console.log(err));
    }
  };

  fetchDispatchUnit = () => {
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
  };

  renderDispatchDetails = () => {
    if (this.state.dispatchedUnits.length > 0) {
      return (
        <table>
          <tbody>
            {this.state.dispatchedUnits.map((unit, index) => {
              return (
                <tr key={index}>
                  <td>{unit.call_sign} - </td>
                  <td>{unit.type}</td>&emsp;
                  <td>{unit.veh_status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      return (
        <p className={s.tips}>
          No dispatch units assigned to this incident yet.
        </p>
      );
    }
  };

  fetchIncident = () => {
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
  };

  renderResolveBtn = () => {
    const { incident } = this.state;
    if (
      incident.status !== Enum.incidentStatus.RESOLVED &&
      incident.status !== Enum.incidentStatus.CLOSED
    ) {
      return (
        <span>
          <hr />

          <div className={s.buttonPanel}>
            <div className={s.resolveBtn} onClick={this.resolveCase}>
              Mark Case as Resolved
            </div>
          </div>
        </span>
      );
    }
  };

  renderSidebar() {
    const { incident } = this.state;
    if (
      incident.status !== Enum.incidentStatus.RESOLVED &&
      incident.status !== Enum.incidentStatus.CLOSED
    ) {
      return <DispatchVehicleList {...this.props} />;
    } else {
      return <SubmitReportPanel incidentId={incident.id} />;
    }
  }

  sendSMS = () => this.props.mountModal('sms', this.state.incident);
  sendEmail = () => this.props.mountModal('email', this.state.incident);
  sendSocial = () => this.props.mountModal('social', this.state.incident);

  render() {
    const { incident } = this.state;
    const { user } = this.props;

    let statusClass;
    switch (incident.status) {
      case Enum.incidentStatus.DISPATCHED:
        statusClass = s.dispatched;
        break;
      case Enum.incidentStatus.ON_SITE:
        statusClass = s.onsite;
        break;
      case Enum.incidentStatus.ENROUTE:
        statusClass = s.enrouteBack;
        break;
      case Enum.incidentStatus.RESOLVED:
        statusClass = s.resolved;
        break;
      case Enum.incidentStatus.CLOSED:
        statusClass = s.caseClosed;
        break;
      default:
        statusClass = s.dispatched;
    }

    return (
      Object.keys(incident).length != 0 && (
        <div className={s.content}>
          <div className={s.leftCol + ' ' + (user.role_id == 5 && s.fullWidth)}>
            <div className={s.back} onClick={this.props.displayList}>
              <img width="8" src={backBtn} />
              <span className={s.backText}>Back</span>
            </div>
            <br />
            <div className={s.header}>
              {formatUtils.formatCategoryName(incident.category)} -{' '}
              {incident.address}, {incident.postal_code}
            </div>

            <div className={s.caseNumStatus}>
              <span className={s.caseNo}>Case No: {incident.id}</span>
              &emsp;&emsp;
              <div className={`${s.status} ${statusClass}`}>
                {incident.status}
              </div>
            </div>

            <br />

            <div className={s.segment}>
              <div className={s.header2}>Incident Description</div>
              <p>{incident.description}</p>
            </div>

            <div className={s.segment}>
              <div className={s.header2}>Map Location</div>
              <IncidentDetailMap
                address={incident.postal_code}
                center={{ lat: incident.lat, lng: incident.lng }}
                zoom={12}
              />
            </div>

            <div className={s.segment}>
              <div className={s.header2}>Incident Details</div>
              <p>
                Create At: {formatUtils.formatDate(incident.created_at)}
                <br />
                Incident Location: {incident.address}, {incident.postal_code}
                <br />
                Caller Information: {incident.caller}, {incident.caller_contact}
              </p>
            </div>

            <div className={s.segment}>
              <div className={s.header2}>Dispatch Details</div>
              {this.renderDispatchDetails()}
            </div>

            {user.role_id != 5 && this.renderResolveBtn()}

            {user.role_id != 5 && <hr />}

            {user.role_id != 5 && (
              <div className={s.descriptionPanel}>
                <AlertedIncidentDesc incidentId={incident.id} />
              </div>
            )}

            {user.role_id == 5 &&
              incident.status != Enum.incidentStatus.CLOSED && (
                <div className={s.segment}>
                  <div className={s.header2}>Broadcast Actions</div>
                  <div className={s.broadcastActions}>
                    <div className={s.actionBubble} onClick={this.sendSMS}>
                      <img src={smsIcon} alt="SMS" />
                      <p className={s.actionName}>Warning SMS</p>
                    </div>
                    <div className={s.actionBubble} onClick={this.sendEmail}>
                      <img src={emailIcon} alt="email" />
                      <p className={s.actionName}>Email Alert</p>
                    </div>
                    <div className={s.actionBubble} onClick={this.sendSocial}>
                      <img src={socialIcon} alt="social" />
                      <p className={s.actionName}>Social Media</p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {user.role_id != 5 && (
            <div className={s.rightCol}>{this.renderSidebar()}</div>
          )}
        </div>
      )
    );
  }
}

export default withStyles(s)(AlertedIncidentDetail);
