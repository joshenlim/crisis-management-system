import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class EAQuestionSet extends React.Component {
  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Vehicle Plate Numbers:</p>
            <p className={s.subtitle}>Comma Separated For Multiple</p>
          </div>
          <input
            className={s.textInput}
            name="plateNumber"
            type="text"
          />
        </div>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Incident Description:</p>
          </div>
          <textarea
            className={s.textInput}
            name="description"            
            rows={3}
            cols={30}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(EAQuestionSet);
