import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import formatUtils from '../../formatUtils';
import s from './GcDashboard.scss';
import arrow from '../../assets/images/down-arrow.svg'

class GcCasualtyList extends React.Component {
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
            <p className={s.category}>List of Casualties</p>
          </div>
        </div>


      </div>
    );
  }
}

export default withStyles(s)(GcCasualtyList);
