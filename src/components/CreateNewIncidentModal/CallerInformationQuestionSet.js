import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class CallerInformationQuestionSet extends React.Component {
  static propTypes = {
    onCallerNameChange: PropTypes.func.isRequired,
    onCallerContactChange: PropTypes.func.isRequired
  };

  onCallerNameChange = (event) => {
    this.props.onCallerNameChange(event.target.value);
  };

  onCallerContactChange = (event) => {
    this.props.onCallerContactChange(event.target.value);
  };

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Caller Name:</p>
          </div>
          <input
            onChange={this.onCallerNameChange}
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
            onChange={this.onCallerContactChange}
            className={s.textInput}
            name="caller_contact"
            type="number"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CallerInformationQuestionSet);
