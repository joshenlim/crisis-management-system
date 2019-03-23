import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class FFQuestionSet extends React.Component {
  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Rate of Firespread:</p>
          </div>
          <select>
            <option name="rate_firespread" value="low">Low</option>
            <option name="rate_firespread" value="med">Medium</option>
            <option name="rate_firespread" value="high">High</option>
          </select>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FFQuestionSet);
