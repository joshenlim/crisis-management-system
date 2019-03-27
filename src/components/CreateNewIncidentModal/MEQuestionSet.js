import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';

class MEQuestionSet extends React.Component {
  static propTypes = {
    onCurrConditionChange: PropTypes.func.isRequired,
    onLevelConscChange: PropTypes.func.isRequired,
    onSuicideChange: PropTypes.func.isRequired,
    onSuicidalEquipmentChange: PropTypes.func.isRequired,
    onSuicidalMethodChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      committed_suicide: false,
    };
  }

  selectCommittedSuicide = () => {
    this.setState({ committed_suicide: !this.state.committed_suicide })
    this.props.onSuicideChange(!this.state.committed_suicide);
  }

  updateSelectedConsciousness = (event) => {
    this.props.onLevelConscChange(event.target.value)
  }

  onCurrConditionChange = (event) => {
    this.props.onCurrConditionChange(event.target.value)
  }

  onSuicidalEquipmentChange = (event) => {
    this.props.onSuicidalEquipmentChange(event.target.value)
  }

  onSuicidalMethodChange = (event) => {
    this.props.onSuicidalMethodChange(event.target.value)
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
            name="curr_condition"
            type="text"
            onChange={this.onCurrConditionChange}
          />
        </div>

        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Level of Consciousness:</p>
          </div>
          <select onChange={this.updateSelectedConsciousness}>
            <option value="alert">Alert (GSC 15)</option>
            <option value="confused">Confused (GSC 13)</option>
            <option value="drowzy">Drowzy (GSC 10)</option>
            <option value="unconscious">Unconscious (GSC 6)</option>
          </select>
        </div>

        <div className={s.textQuestion}>
          <div className={s.question}>
            <p className={s.title}>Committed Suicide:</p>
          </div>
          <input
            name="committed_suicide"
            type="checkbox"
            onChange={this.selectCommittedSuicide}
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
              onChange={this.onSuicidalMethodChange}
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
              name="suicide_equipment"
              type="text"
              onChange={this.onSuicidalEquipmentChange}
            />
          </div>
        }

      </div>
    );
  }
}

export default withStyles(s)(MEQuestionSet);
