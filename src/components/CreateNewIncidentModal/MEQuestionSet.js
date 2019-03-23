import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class MEQuestionSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      committed_suicide: false,
    };
    this.selectCommittedSuicide = this.selectCommittedSuicide.bind(this);
  }

  selectCommittedSuicide = () => {
    this.setState({
      committed_suicide: !this.state.committed_suicide,
    })
  }

  render() {
    return (
      <div className={s.questionSet}>
        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Current Medical Condition:</p>
          </div>
          <input
            className={s.textInput}
            name="med_condition"
            type="text"
          />
        </div>

        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Level of Consciousness:</p>
          </div>
          <select>
            <option name="level_consciousness" value="alert">Alert (GSC 15)</option>
            <option name="level_consciousness" value="confused">Confused (GSC 13)</option>
            <option name="level_consciousness" value="drowzy">Drowzy (GSC 10)</option>
            <option name="level_consciousness" value="unconscious">Unconscious (GSC 6)</option>
          </select>
        </div>

        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Committed Suicide:</p>
          </div>
          <input
            name="committed_suicide"
            onChange={this.selectCommittedSuicide}
            type="checkbox"
          />
        </div>

        {
          this.state.committed_suicide && <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Suicidal Method:</p>
            </div>
            <input
              className={s.textInput}
              name="suicide_method"
              type="text"
            />
          </div>
        }

        {
          this.state.committed_suicide && <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Suicidal Equipment:</p>
              <p className={s.subtitle}>If applicable:</p>
            </div>
            <input
              className={s.textInput}
              name="suicide_method"
              type="text"
            />
          </div>
        }

      </div>
    );
  }
}

export default withStyles(s)(MEQuestionSet);
