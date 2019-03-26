import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class RTAQuestionSet extends React.Component {
  static propTypes = {
    onVehicleTypeChange: PropTypes.func.isRequired,
    onVehiclePlateChange: PropTypes.func.isRequired
  };

  onVehicleTypeChange = (event) => {
    this.props.onVehicleTypeChange(event.target.value);
  };

  onVehiclePlateChange = (event) => {
    this.props.onVehiclePlateChange(event.target.value);
  };

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Vehicle Plate Number:</p>
          </div>
          <input
            className={s.textInput}
            name="vehicle_plate"
            type="text"
            onChange={this.onVehiclePlateChange}
          />
        </div>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Vehicle Type:</p>
          </div>
          <input
            className={s.textInput}
            name="vehicle_type"
            type="text"
            onChange={this.onVehicleTypeChange}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(RTAQuestionSet);
