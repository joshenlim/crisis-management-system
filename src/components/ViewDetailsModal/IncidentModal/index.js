import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';
import { API_HOST } from '../../../constants';
import formatUtils from '../../../formatUtils';
import DispatchMap from '../DispatchMap';
import DispatchVehicleList from '../DispatchVehicleList';

class IncidentModal extends Component {
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
      .then(data => {
        const incidentDetails = data[0];
        switch (formatUtils.formatCategoryName(incidentDetails.category)) {
          case Enum.incidentCategory.TRAFFIC:
            fetch(API_HOST + 'api/incident/get_RTA_details?id=' + this.props.id, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
              .then(res => res.json())
              .then(data => {
                this.setState({
                  incident: {
                    ...incidentDetails, additionalFields: {
                      vehicle_plate: data.length > 0 ? data[0].vehicle_plate : "Missing",
                      vehicle_type: data.length > 0 ? data[0].vehicle_type : "Missing",
                      if_alerted: data.length > 0 ? data[0].if_alerted : false,
                    }
                  }
                })
              })
            break;

          case Enum.incidentCategory.FIRE:
            fetch(API_HOST + 'api/incident/get_FE_details?id=' + this.props.id, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
              .then(res => res.json())
              .then(data => {
                this.setState({
                  incident: {
                    ...incidentDetails, additionalFields: {
                      fire_spread_rate: data.length > 0 ? data[0].fire_spread_rate : "Missing",
                    }
                  }
                })
              })
            break;

          case Enum.incidentCategory.MEDICAL:
            fetch(API_HOST + 'api/incident/get_ME_details?id=' + this.props.id, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
              .then(res => res.json())
              .then(data => {
                this.setState({
                  incident: {
                    ...incidentDetails, additionalFields: {
                      curr_condition: data.length > 0 ? data[0].curr_condition : "Missing",
                      level_of_consc: data.length > 0 ? data[0].level_of_consc : "Missing",
                      if_suicide: data.length > 0 ? data[0].if_suicide : "Missing",
                      suicidal_method: data.length > 0 ? data[0].suicidal_method : "Missing",
                      suicidal_equipment: data.length > 0 ? data[0].suicidal_equipment : "Missing",
                    }
                  }
                })
              })
            break;

          default:
            this.setState({
              incident: { ...incidentDetails }
            })
            break;
        }
      })
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

  renderIncidentCatDetails = (category) => {
    const { incident } = this.state;
    switch (formatUtils.formatCategoryName(category)) {
      case Enum.incidentCategory.TRAFFIC:
        return <table>
          <tbody>
            <tr>
              <td className={s.detailHeader}>Vehicle Plate: </td>
              <td>{incident.additionalFields.vehicle_plate}</td>
            </tr>
            <tr>
              <td className={s.detailHeader}>Vehicle Type: </td>
              <td>{incident.additionalFields.vehicle_type}</td>
            </tr>
          </tbody>
        </table>
      case Enum.incidentCategory.FIRE:
        return <table>
          <tbody>
            <tr>
              <td className={s.detailHeader}>Fire Spread Rate: </td>
              <td>{incident.additionalFields.fire_spread_rate}</td>
            </tr>
          </tbody>
        </table>
      case Enum.incidentCategory.MEDICAL:
        return <table>
          <tbody>
            <tr>
              <td className={s.detailHeader}>Patient Current Condition: </td>
              <td>{incident.additionalFields.curr_condition}</td>
            </tr>
            <tr>
              <td className={s.detailHeader}>Level of Consciousness: </td>
              <td>{incident.additionalFields.level_of_consc}</td>
            </tr>
            <tr>
              <td className={s.detailHeader}>If Suicide: </td>
              <td>{incident.additionalFields.if_suicide == 1 ? "Yes" : "No"}</td>
            </tr>
            {
              incident.additionalFields.if_suicide == 1 && <tr>
                <td className={s.detailHeader}>Suicidal Method: </td>
                <td>{incident.additionalFields.suicidal_method}</td>
              </tr>
            }
            {
              incident.additionalFields.if_suicide == 1 && <tr>
                <td className={s.detailHeader}>Suicidal Equipment: </td>
                <td>{incident.additionalFields.suicidal_equipment}</td>
              </tr>
            }
          </tbody>
        </table>
      default:
        return <table></table>
    }
  }

  componentDidMount() {
    this.fetchIncident();
    this.fetchDispatchedVehicles();
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.dispatchUnits(this.state.incident.id, this.state.vehicleDispatch)
  }

  closeIncident = () => {
    if (confirm(`Confirm to close Incident ID: ${this.state.incident.id}?`)) {
      this.props.closeIncident(this.state.incident.id);
    }
  }

  updateAlert = (event) => {
    const { incident } = this.state;
    const alertType = event.target.name;
    if (alertType == "SPF") {
      const alertUpdate = incident.if_alerted == 0 ? 1 : 0;
      this.setState({
        incident: { ...incident, if_alerted: alertUpdate }
      })
      this.props.updateAlert(alertType, incident.id, alertUpdate)
    } else if (alertType == "LTA") {
      const alertUpdate = incident.additionalFields.if_alerted == 0 ? 1 : 0;
      this.setState({
        incident: {
          ...incident,
          additionalFields: {
            ...incident.additionalFields,
            if_alerted: alertUpdate,
          }
        }
      })
      this.props.updateAlert(alertType, incident.id, alertUpdate)
    }
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
          page == 1 && <div className={s.incidentDetailBody}>
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
                      {
                        vehicle_incidents.map((vehicle_incident, index) => {
                          return <td key={index}>{vehicle_incident.plate_number},{' '}</td>
                        })
                      }
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

              {this.renderIncidentCatDetails(incident.category)}

            </div>
            
            <p className={s.contentHeader}>Alert Relevant Authorities</p>
            <div className={s.contentBody}>
              <div className={s.textQuestion}>
                <div className={s.question}>
                  <p className={s.title}>Alerted SPF:</p>
                </div>
                <input
                  name="SPF"
                  type="checkbox"
                  checked={incident.if_alerted}
                  onChange={this.updateAlert}
                />
              </div>
              {
                incident.category == "road_traffic_accident" && <div className={s.textQuestion}>
                  <div className={s.question}>
                    <p className={s.title}>Alerted LTA:</p>
                  </div>
                  <input
                    name="LTA"
                    type="checkbox"
                    checked={incident.additionalFields.if_alerted}
                    onChange={this.updateAlert}
                  />
                </div>
              }
            </div>

            <p className={s.contentHeader}>Dispatchment Details</p>
            <div className={s.contentBody}>
              {
                formattedDispatch.length > 0 && formattedDispatch.map((station, index) => {
                  return <div key={index} className={s.dispatchStation}>
                    <p className={s.stationName}>{station.station_name}</p>
                    <ul className={s.dispatchList}>
                      {
                        station.dispatch.map((vehicle, index) => {
                          return <li key={index} className={s.dispatchInfo}>{vehicle.call_sign} - {vehicle.type}</li>
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
          </div>
        }

        {
          incident.status != "CLOSED" && page == 1 && <div>
            <hr />
            <div className={s.closeIncButton} onClick={this.closeIncident}>
              Close Incident
            </div>
          </div>
        }

        {
          page == 2 && <form onSubmit={this.onSubmit}>
            <p className={s.contentHeader}>Select a department to dispatch the case to - dropdown to view department status details.</p>
            <div className={s.dispatchUnits}>
              <div className={s.dispatchList}>
                <DispatchVehicleList fireStationList={fireStationList} updateVehicleDispatch={this.updateVehicleDispatch} />
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