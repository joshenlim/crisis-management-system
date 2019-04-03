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
      station_incidents: [],
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

  fetchStationIncident = () => {
    fetch(API_HOST + 'api/station/get_station_details_from_incident?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ station_incidents: data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    //TODO - AJAX to API for selecting incident with this.props.id
    this.fetchIncident();
    this.fetchVehicleIncident();
    this.fetchStationIncident();
    console.log(this.props.id);
  }

  formatAbbrev = (category) => {
    return category.split("_").map((str) => {
      return str.charAt(0).toUpperCase()
    }).join("")
  }

  render() {
    const { incidents, vehicle_incidents, station_incidents } = this.state;
    var statusClass = '';
    console.log(this.props.id);
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
        {incidents.map(incident => <div className={s.caseNo}>Case No: {this.formatAbbrev(incident.category)}-{incident.id}</div>)} &ensp;
        {incidents.map(incident => <div className={`${s.status} ${statusClass}`}>{incident.status}</div>)}
        <hr />
        <p className={s.contentHeader}>Incident Description</p>
        {incidents.map(incident => <div className={s.contentBody}>{incident.description}</div>)}
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
                {vehicle_incidents.map(vehicle_incident =><td>{vehicle_incident.plate_number},{' '}</td>)}
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
        {station_incidents.map(station =><div>{station.name}:{' '}{station.plate_number}{' '}-{' '}{station.type}</div>)}
        <div />
      </div>
    );
  }
}

export default withStyles(s)(IncidentModal);
