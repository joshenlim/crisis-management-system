import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class IncidentLocationSet extends React.Component {
  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Postal Code:</p>
          </div>
          <input
            className={s.textInput}
            name="postalCode"
            type="text"
          />
        </div>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Building Unit Number:</p>
            <p className={s.subtitle}>Only if applicable</p>
          </div>
          <input
            className={s.textInput}
            name="unitNumber"
            type="text"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(IncidentLocationSet);
