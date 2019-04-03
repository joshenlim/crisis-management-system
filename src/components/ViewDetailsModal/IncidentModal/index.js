import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';
import { API_HOST } from '../../../constants';

class IncidentModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      caller_name: '',
      caller_contact: '',
      category: '',
      postal_code: '',
      address: '',
      status: '',
      description: '',
      created_at: '',
      plate_number: '',
      veh_status: '',
      incidents: [],
      vehicle_incidents: [],
    };
  }

  fetchIncident = () => {
    fetch(API_HOST + 'api/incident/get?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ incidents: data }))
      .catch(err => console.log(err));
  }

  fetchVehicleIncident = () => {
    fetch(API_HOST + 'api/incident/get_vehicleIncident?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ vehicle_incidents: data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    //TODO - AJAX to API for selecting incident with this.props.id
    this.fetchIncident();
    this.fetchVehicleIncident();

    this.state.id = this.state.incidents.id;
    this.state.caller_name = this.state.incidents.caller_name;
    this.state.caller_contact = this.state.incidents.caller_contact;
    this.state.category = this.state.incidents.category;
    this.state.postal_code = this.state.incidents.postal_code;
    this.state.address = this.state.incidents.address;
    this.state.status = this.state.incidents.status;
    this.state.description = this.state.incidents.description;
    this.state.created_at = this.state.incidents.created_at;
    this.state.plate_number = this.state.vehicle_incidents.plate_number;
    this.state.veh_status = this.state.vehicle_incidents.veh_status;
  }

  render() {
    const { incidents, vehicle_incidents } = this.state;
    var statusClass = '';
    switch (this.state.status) {
      case Enum.incidentStatus.DISPATCHED:
        statusClass = s.dispatched;
        break;
      case Enum.incidentStatus.ON_SITE:
        statusClass = s.onsite;
        break;
      case Enum.incidentStatus.ENROUTE:
        statusClass = s.enrouteBack;
        break;
      default:
        statusClass = s.dispatched;
    }

    return (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
        {incidents.map(incident =>
          <p>{incident.category} - {incident.postal_code},{' '}{incident.address}</p>
        )}
          </p>
        </div>
        <div className={s.caseNo}>Case No: {incidents.map(incident => {incident.id})}</div> &ensp;
        <div className={`${s.status} ${statusClass}`}>{incidents.map(incident => {incident.status})}</div>
        <hr />
        <p className={s.contentHeader}>Incident Description</p>
        <div className={s.contentBody}>{incidents.map(incident => {incident.description})}</div>
        <p className={s.contentHeader}>Incident Details</p>
        <div className={s.contentBody}>
          <table>
            <tbody>
              <tr>
                <td className={s.detailHeader}>Date and Time of Call: </td>
                {incidents.map(incident => <td>{incident.created_at}</td>)}
              </tr>
              <tr>
                <td className={s.detailHeader}>Vehicle Plate Number: </td>
                {vehicle_incidents.map(vehicle_incident => <td>{vehicle_incident.plate_number}</td>)}
              </tr>
              <tr>
                <td className={s.detailHeader}>Incident Location: </td>
                {incidents.map(incident => <td>{incident.postal_code},{' '}{incident.address}</td>)}
              </tr>
              <tr>
                <td className={s.detailHeader}>Caller Information: </td>
                {incidents.map(incident => <td>{incident.caller_name},{' '}{incident.caller_contact}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <p className={s.contentHeader}>Dispatchment Details</p>
        <div>Sengkang Fire Station</div>
        <div />
      </div>
    );
  }
}

export default withStyles(s)(IncidentModal);
