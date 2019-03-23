import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class CallerInformationQuestionSet extends React.Component {
  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Caller Name:</p>
          </div>
          <input
            className={s.textInput}
            name="caller_name"
            type="text"
          />
        </div>
        <div className={s.textQuestion}>
        <div className={s.question}>
            <p className={s.title}>Caller Mobile Number:</p>
          </div>
          <input
            className={s.textInput}
            name="caller_mobile"
            type="text"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CallerInformationQuestionSet);
