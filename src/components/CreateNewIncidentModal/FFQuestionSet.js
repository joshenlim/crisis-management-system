import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class FFQuestionSet extends React.Component {
  static propTypes = {
    onFireSpreadRateChange: PropTypes.func.isRequired,
  };

  selectFirespreadRate = (event) => {
    this.props.onFireSpreadRateChange(event.target.value);
  }

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Rate of Firespread:</p>
          </div>
          <select onChange={this.selectFirespreadRate}>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FFQuestionSet);
