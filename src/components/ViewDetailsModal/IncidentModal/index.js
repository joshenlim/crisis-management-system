import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';
import { API_HOST } from '../../../constants';
import formatUtils from '../../../formatUtils';
import DispatchMap from '../DispatchMap';
import DispatchVehicleList from '../DispatchVehicleList';

class IncidentModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      incident: {},
      dispatched_vehicles: [],
      vehicleDispatch: [],
    };
  }

  nextPage = () => this.props.nextPage();
  prevPage = () => this.props.prevPage();
  updateVehicleDispatch = (vehicles) => this.setState({ vehicleDispatch: vehicles });

  fetchIncident = () => {
    fetch(API_HOST + 'api/incident/get?id=' + this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ incident: data[0] }))
      .catch(err => console.log(err));
  }

  fetchDispatchedVehicles = () => {
    fetch(API_HOST + 'api/incident/get_vehicleIncident?id=' + this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ dispatched_vehicles: data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchIncident();
    this.fetchDispatchedVehicles();
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.dispatchUnits(this.state.incident.id, this.state.vehicleDispatch)
  }

  render() {
    const { incident, dispatched_vehicles } = this.state;
    const { page, fireStationList } = this.props;
    const formattedDispatch = formatUtils.formatDispatchVehicles(dispatched_vehicles);
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

    return Object.keys(incident).length != 0 && (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            {formatUtils.formatCategoryName(incident.category)} - {incident.postal_code}, {incident.address}
          </p>
        </div>
        <div className={s.caseNo}>
          Case No: {formatUtils.formatAbbrev(incident.category)}-{incident.id}
        </div>
        <div className={`${s.status} ${statusClass}`}>
          {incident.status}
        </div>

        <hr />

        {
          page == 1 && <div>
            <p className={s.contentHeader}>Incident Description</p>
            <div className={s.contentBody}>{incident.description}</div>

            <p className={s.contentHeader}>Incident Details</p>
            <div className={s.contentBody}>
              <table>
                <tbody>
                  <tr>
                    <td className={s.detailHeader}>Date and Time of Call: </td>
                    <td>{formatUtils.formatDate(incident.created_at)}</td>
                  </tr>
                  {
                    incident.category == "road_traffic" && <tr>
                      <td className={s.detailHeader}>Vehicle Plate Number: </td>
                      {vehicle_incidents.map(vehicle_incident => <td>{vehicle_incident.plate_number},{' '}</td>)}
                    </tr>
                  }
                  <tr>
                    <td className={s.detailHeader}>Incident Location: </td>
                    <td>{incident.postal_code},{' '}{incident.address}</td>
                  </tr>
                  <tr>
                    <td className={s.detailHeader}>Caller Information: </td>
                    <td>{incident.caller_name},{' '}{incident.caller_contact}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={s.contentHeader}>Dispatchment Details</p>
            <div className={s.contentBody}>
              {
                formattedDispatch.length > 0 && formattedDispatch.map((station) => {
                  return <div className={s.dispatchStation}>
                    <p className={s.stationName}>{station.station_name}</p>
                    <ul className={s.dispatchList}>
                      {
                        station.dispatch.map((vehicle) => {
                          return <li className={s.dispatchInfo}>{vehicle.call_sign} - {vehicle.type}</li>
                        })
                      }
                    </ul>
                  </div>
                })
              }
              {
                formattedDispatch.length == 0 && <p className={s.noDispatch}>There are no units dispatched to this incident</p>
              }
              <p className={s.dispatchAdditional} onClick={this.nextPage}>Dispatch Additional Units</p>
            </div>

            {
              incident.status != "CLOSED" && <div>
                <hr />
                <div className={s.closeIncButton}>
                  Close Incident
                </div>
              </div>
            }
          </div>
        }

        {
          page == 2 && <form onSubmit={this.onSubmit}>
            <p className={s.contentHeader}>Select a department to dispatch the case to - dropdown to view department status details.</p>
            <div className={s.dispatchUnits}>
              <div className={s.dispatchList}>
                <DispatchVehicleList fireStationList={fireStationList} updateVehicleDispatch={this.updateVehicleDispatch}/>
              </div>
              <div className={s.dispatchMap}>
                <DispatchMap
                  center={{ lat: incident.lat, lng: incident.lng }}
                  zoom={12}
                  address={incident.address}
                />
              </div>
            </div>
            <div className={s.btnGrp}>
              <div
                className={s.prevButton}
                onClick={this.prevPage}>
                Back
              </div>
              <button className={s.button} value="Submit" type="submit">
                Update Incident
              </button>
            </div>
          </form>
        }

      </div>
    );
  }
}

export default withStyles(s)(IncidentModal);
