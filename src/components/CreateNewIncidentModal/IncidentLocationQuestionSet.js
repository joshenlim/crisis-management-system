import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class IncidentLocationSet extends React.Component {

  onPostalCodeChange = (event) => {
    this.props.onPostalChange(event.target.value);
  }

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Postal Code:</p>
          </div>
          <input
            className={s.textInput}
            name="postal_code"
            type="text"
            onChange={this.onPostalCodeChange}
          />
        </div>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Location Address:</p>
            <p className={s.subtitle}>Only if applicable</p>
          </div>
          <input
            className={s.textInput}
            name="unit_number"
            type="text"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(IncidentLocationSet);
