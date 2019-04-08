import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import formatUtils from '../../formatUtils';
import s from './GcDashboard.scss';
import arrow from '../../assets/images/down-arrow.svg'

class GcAddCasualty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nric: "",
      name: "",
      race: "",
      gender: "",
      curr_condition: "",
      allergy: "",
      level_of_consc: "Alert",
      medical_history: "",
      hospital_id: this.props.hospitalList[0].id,
    }
  }

  updateNRIC = (event) => this.setState({ nric: event.target.value })
  updateName = (event) => this.setState({ name: event.target.value })
  updateRace = (event) => this.setState({ race: event.target.value })
  updateGender = (event) => this.setState({ gender: event.target.value })
  updateCondition = (event) => this.setState({ curr_condition: event.target.value })
  updateAllergy = (event) => {
    if (event.target.value.length > 0) this.setState({allergy: event.target.value })
    else this.setState({ allergy: "none" })
  }
  updateConsc = (event) => this.setState({ level_of_consc: event.target.value })
  updateMedHist = (event) => {
    if (event.target.value.length > 0) this.setState({ medical_history: event.target.value })
    else this.setState({ medical_history: "none" })
  }
  updateHospital = (event) => this.setState({ hospital_id: event.target.value })

  addCasualtyInfo = () => {
    this.props.addCasualtyInfo(this.state)
  }

  render() {
    const { incident, hospitalList } = this.props
    return (
      <div className={s.incidentDetail}>
        <p className={s.backBtn} onClick={this.props.prevPage}>
          <span><img src={arrow}/></span>
          Back
        </p>

        <div className={s.header}>
          <div className={s.incidentDetail}>
            <p className={s.caseNo}>Case No: {formatUtils.formatAbbrev(incident.category)} - {incident.id}</p>
            <p className={s.category}>New Casualty Information</p>
          </div>
        </div>

        <div className={s.questionSet}>
          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Patient NRIC:</p>
            </div>
            <input
              onChange={this.updateNRIC}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Patient Name:</p>
            </div>
            <input
              onChange={this.updateName}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Patient Race:</p>
            </div>
            <input
              onChange={this.updateRace}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Patient Gender:</p>
            </div>
            <input
              onChange={this.updateGender}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Current Condition:</p>
            </div>
            <input
              onChange={this.updateCondition}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Any Allergies:</p>
            </div>
            <input
              onChange={this.updateAllergy}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Medical History:</p>
            </div>
            <input
              onChange={this.updateMedHist}
              className={s.textInput}
              type="text"
            />
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Level of Consciousness:</p>
            </div>
            <select onChange={this.updateConsc}>
              <option value="Alert">Alert (GSC 15)</option>
              <option value="Confused">Confused (GSC 13)</option>
              <option value="Drowzy">Drowzy (GSC 10)</option>
              <option value="Unconscious">Unconscious (GSC 6)</option>
            </select>
          </div>

          <div className={s.textQuestion}>
            <div className={s.question}>
              <p className={s.title}>Assigned Hospital:</p>
            </div>
            <select onChange={this.updateHospital}>
              {
                hospitalList.map((hospital) => {
                  return <option value={hospital.id}>{hospital.name} ({hospital.ownership})</option>
                })
              }
            </select>
          </div>
        </div>

        <hr />

        <div className={s.btnGroup}>
          <div className={s.statusReportBtn} onClick={this.addCasualtyInfo}>
            Add Casualty Information
          </div>
        </div>

      </div>
    );
  }
}

export default withStyles(s)(GcAddCasualty);
