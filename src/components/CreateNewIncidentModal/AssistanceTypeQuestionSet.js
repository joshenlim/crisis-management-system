import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class AssistanceTypeQuestionSet extends React.Component {
  static propTypes = {
    updateSelectedType: PropTypes.func.isRequired
  };

  updateAssistanceType = (event) => {
    this.props.updateSelectedType(event.target.id);
  };

  render() {
    return (
      <div className={s.radioBody}>
        <div className={s.radioColumn}>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="EA"
              name="assistance_type"
              value="emergency_ambulance"
              onChange={this.updateAssistanceType}
              defaultChecked
            />
            <label for="EA">Emergency Ambulance</label>
          </div>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="RE"
              name="assistance_type"
              value="rescue_evacuation"
              onChange={this.updateAssistanceType}
            />
            <label for="RE">Rescue and Evacuation</label>
          </div>
        </div>
        <div className={s.radioColumn}>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="FF"
              name="assistance_type"
              value="fire_fighting"
              onChange={this.updateAssistanceType}
            />
            <label for="FF">Fire-Fighting</label>
          </div>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="GL"
              name="assistance_type"
              value="gas_leak"
              onChange={this.updateAssistanceType}
            />
            <label for="GL">Gas Leak Control</label>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AssistanceTypeQuestionSet);
