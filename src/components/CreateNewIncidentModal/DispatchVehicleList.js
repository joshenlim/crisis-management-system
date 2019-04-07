import React from 'react';
import s from './CreateNewIncidentModal.scss';
import expandDrop from '../../assets/images/down-arrow.svg';

class DispatchVehicleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStationId: 0,
      selectedStations: [],
    }
    this.expandDropdown = this.expandDropdown.bind(this);
  }

  expandDropdown(event) {
    if (this.state.selectedStationId == event.target.id) {
      this.setState({ selectedStationId: 0 })
    } else {
      this.setState({ selectedStationId: event.target.id })
    }
  }

  updateVehicleDispatch = (event) => {
    let found = false;
    const { selectedStations } = this.state;
    const selected = {
      id: event.target.id,
      plate: event.target.value,
    }
    selectedStations.forEach((station) => {
      if (station.id == selected.id) found = true;
      return;
    })

    if (found) {
      selectedStations.splice(selectedStations.indexOf(selected), 1)
      this.setState({ selectedStations: selectedStations });
      this.props.updateVehicleDispatch(selectedStations);
    } else {
      selectedStations.push(selected)
      this.setState({ selectedStations: selectedStations })
      this.props.updateVehicleDispatch(selectedStations);
    }
  };

  render() {
    const { fireStationList } = this.props;
    return (
      <div className={s.stationList}>
        {
          fireStationList.map((station, index) => {
            if (station.vehicles.length) {
              return (
                <div
                  className={s.stationTile + " " + (this.state.selectedStationId == station.id ? s.openDropdown : "")} key={index}>
                  <div className={s.tileHeader}>
                    <p className={s.stationName}>{station.name}</p>
                    <img
                      id={station.id}
                      className={s.expandDrop}
                      src={expandDrop}
                      alt="expand"
                      onClick={this.expandDropdown} />
                  </div>
                  <div className={s.vehicleList}>
                    {
                      station.vehicles.map((vehicle, index) => {
                        return (
                          <div className={s.vehicleOption} key={index}>
                            <input
                              name="selectedVehicles"
                              type="checkbox"
                              value={vehicle.plate_number}
                              id={vehicle.call_sign}
                              disabled={vehicle.on_off_call}
                              onChange={this.updateVehicleDispatch}
                            />
                            <label htmlFor={vehicle.call_sign}>
                              {vehicle.call_sign} - {vehicle.type}
                            </label>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    );
  }
}

export default DispatchVehicleList;
