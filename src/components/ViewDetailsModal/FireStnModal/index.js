import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';
import { API_HOST } from '../../../constants';

class FireStnModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      station_id: '',
      station_name: '',
      vehicle_id: '',
      vehicle_type: '',
      vehicle_on_off_call: '',
      incident_id: '',
      stations: [],
      station_vehicles: [],
    };
  }

  fetchStation = () => {
    fetch(API_HOST + 'api/station/get_station_by_id?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ stations: data }))
      .catch(err => console.log(err));
  }

  fetchStationIncident = () => {
    fetch(API_HOST + 'api/station/get_station_vehicles_details?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ station_vehicles: data }))
      .catch(err => console.log(err));
  }

  componentWillMount() {
    //TODO - AJAX to API for selecting fire station details with this.props.id
    this.fetchStationIncident();
    this.fetchStation();
  }

  render() {
    const { stations, station_vehicles } = this.state;
 
    return (
      <div>
        <div className={s.segment}>
          {stations.map(station =><p className={s.category}>
            {station.name}
          </p>)}
        </div>

        <hr />
        <p className={s.contentHeader}>Vehicle Status</p>
        <table>
          <thead>
            <tr>
              <td className={s.contentHeader}>Callsign</td>
              <td className={s.contentHeader}>Type</td>
              <td className={s.contentHeader}>On Call (No/Yes)</td>
              <td className={s.contentHeader}>Case Attached</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {station_vehicles.map(vehicle =><tr>{ vehicle.call_sign }</tr>)}<td>
              {station_vehicles.map(vehicle =><tr>{ vehicle.type }</tr>)}</td>
              {station_vehicles.map(vehicle =><tr>{ vehicle.on_off_call }</tr>)}<td>
              {station_vehicles.map(vehicle_incident =><tr>{ vehicle_incident.on_off_call }</tr>)}</td>
              {station_vehicles.map(vehicle_incident =><tr>{ vehicle_incident.incident_id }</tr>)}<td></td>
              </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(s)(FireStnModal);
