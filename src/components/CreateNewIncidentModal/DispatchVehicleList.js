import React from 'react';
import s from './CreateNewIncidentModal.scss';
import expandDrop from '../../assets/images/down-arrow.svg';

class DispatchVehicleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStationId: 0,
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

  render() {
    const { fireStationList } = this.props;
    console.log(fireStationList);
    return (
      <div className={s.stationList}>
        {
          fireStationList.map((station) => {
            if (station.vehicles.length) {
              return (
                <div
                  className={s.stationTile + " " + (this.state.selectedStationId == station.id ? s.openDropdown : "")}>
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
                      station.vehicles.map((vehicle) => {
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
