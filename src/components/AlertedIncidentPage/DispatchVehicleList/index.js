import React from 'react';
import s from './DispatchVehicleList.scss';
import expandDrop from '../../../assets/images/down-arrow.svg';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class DispatchVehicleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStationId: 0,
      fireStationList: [],
    };
    this.expandDropdown = this.expandDropdown.bind(this);
  }

  componentWillMount() {
    this.fetchAllStation();
  }

  expandDropdown(event) {
    if (this.state.selectedStationId == event.target.id) {
      this.setState({ selectedStationId: 0 });
    } else {
      this.setState({ selectedStationId: event.target.id });
    }
  }

  fetchStationVehicle = (id, ind) => {
    fetch(API_HOST + 'api/station/get_station_vehicles?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        this.state.fireStationList[ind].vehicles = data;
        this.forceUpdate();
      })
      .catch(err => console.log(err));
  };

  fetchAllStation = () => {
    fetch(API_HOST + 'api/station/get_all_station', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ fireStationList: data });
        for (let i = 0; i < data.length; i++) {
          this.fetchStationVehicle(data[i].id, i);
        }
      })
      .catch(err => console.log(err));
  };

  dispatchVeh = () => {
    let checkedBoxes = document.querySelectorAll(
      'input[name=selectedVehicles]:checked',
    );
    checkedBoxes.forEach(checked => {
      fetch(API_HOST + 'api/incident/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident_id: this.props.incidentId,
          plate_number: checked.value,
        }),
      })
        .then(res => res.json())
        .catch(err => {
          console.log(err);
          throw err;
        });
    });
    alert('Vehicles successfully dispatched.');
    this.props.displayList();
  };

  render() {
    const fireStationList = this.state.fireStationList;
    return (
      <div className={s.stationList}>
        <div className={s.title}>Dispatch Additional Units</div>
        {fireStationList.map(station => {
          if (station.vehicles)
            if (station.vehicles.length) {
              return (
                <div
                  className={
                    s.stationTile +
                    ' ' +
                    (this.state.selectedStationId == station.id
                      ? s.openDropdown
                      : '')
                  }
                >
                  <div className={s.tileHeader}>
                    <p className={s.stationName}>{station.name}</p>
                    <img
                      id={station.id}
                      className={s.expandDrop}
                      src={expandDrop}
                      alt="expand"
                      onClick={this.expandDropdown}
                    />
                  </div>
                  <div className={s.vehicleList}>
                    {station.vehicles.map(vehicle => {
                      return (
                        <div className={s.vehicleOption}>
                          <input
                            name="selectedVehicles"
                            type="checkbox"
                            value={vehicle.plate_number}
                            id={vehicle.call_sign}
                            disabled={vehicle.on_off_call}
                          />
                          <label htmlFor={vehicle.call_sign}>
                            {vehicle.call_sign} - {vehicle.type}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
        })}
        <hr />
        <div className={s.buttonPanel}>
          <div className={s.dispatchBtn} onClick={this.dispatchVeh}>
            Send Dispatch
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(DispatchVehicleList);
