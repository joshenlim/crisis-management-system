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
              name="category"
              value="road_traffic"
              onChange={this.updateAssistanceType}
              defaultChecked
            />
            <label htmlFor="EA">Road Traffic Accident</label>
          </div>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="ME"
              name="category"
              value="medical_emergency"
              onChange={this.updateAssistanceType}
            />
            <label htmlFor="ME">Medical Emergency</label>
          </div>
        </div>
        <div className={s.radioColumn}>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="FF"
              name="category"
              value="fire_emergency"
              onChange={this.updateAssistanceType}
            />
            <label htmlFor="FF">Fire Emergency</label>
          </div>
          <div className={s.radioOption}>
            <input
              type="radio"
              id="GL"
              name="category"
              value="gas_leak"
              onChange={this.updateAssistanceType}
            />
            <label htmlFor="GL">Gas Leak Control</label>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AssistanceTypeQuestionSet);
