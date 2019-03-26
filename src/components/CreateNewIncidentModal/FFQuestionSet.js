import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class FFQuestionSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_firespread_rate: 1,
    };
    this.selectFirespreadRate = this.selectFirespreadRate.bind(this);
  }

  selectFirespreadRate = () => {
    this.setState({ selected_firespread_rate: event.target.value })
  }

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Rate of Firespread:</p>
          </div>
          <select value={this.state.selected_firespread_rate} onChange={this.selectFirespreadRate}>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
          <input style={{display: 'none'}} type="text" name="fire_spread_rate" value={this.state.selected_firespread_rate} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FFQuestionSet);
