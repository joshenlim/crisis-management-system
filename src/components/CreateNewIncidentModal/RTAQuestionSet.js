import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class RTAQuestionSet extends React.Component {
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
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(RTAQuestionSet);
