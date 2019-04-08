import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import formatUtils from '../../formatUtils';
import s from './GcDashboard.scss';
import arrow from '../../assets/images/down-arrow.svg'
import { API_HOST } from '../../constants';

class GcCasualtyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      casualtyList: [],
      activeCasualty: '',
      loading: true,
    }
  }

  componentDidMount = () => {
    fetch(API_HOST + 'api/incident/get_casualty_list?id=' + this.props.incident.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          casualtyList: data,
          loading: false
        })
      })
      .catch(err => console.log(err));
  }

  viewCasualty = (event) => {
    const casualtyNric = event.target.id;
    if (casualtyNric == this.state.activeCasualty) {
      this.setState({
        activeCasualty: "",
      })
    } else {
      this.setState({
        activeCasualty: casualtyNric,
      })
    }
  }

  render() {
    const { incident } = this.props;
    const { loading, casualtyList, activeCasualty } = this.state;
    console.log(casualtyList)
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

        {
          loading && <p className={s.notifMsg}>Retrieving Casualty List</p>
        }
        {
          !loading && casualtyList.length == 0 && <p className={s.notifMsg}>There are no casualties</p>
        }
        {
          !loading && casualtyList.length > 0 && <div className={s.casualtyList}>
            {
              casualtyList.map((casualty, index) => {
                return <div key={index} className={s.casualtyCard + " " + (
                  activeCasualty == casualty.nric && s.expandCasualty
                )}>
                  <div className={s.casualtySummary}>
                    <p>{casualty.nric} - {casualty.name}</p>
                    <img id={casualty.nric} className={s.dropdown} src={arrow} onClick={this.viewCasualty}/>
                  </div>
                  <div className={s.casualtyDetails}>
                    <table>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Patient Profile:</td>
                        <td>{casualty.race}, {casualty.gender}</td>
                      </tr>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Current Condition:</td>
                        <td>{casualty.curr_condition}</td>
                      </tr>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Allergy:</td>
                        <td>{casualty.allergy}</td>
                      </tr>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Consciousness:</td>
                        <td>{casualty.level_of_consc}</td>
                      </tr>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Medical History:</td>
                        <td>{casualty.medical_history}</td>
                      </tr>
                      <tr className={s.detailRow}>
                        <td className={s.contentHeader}>Assigned Hospital:</td>
                        <td>{casualty.hospital}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              })
            }
          </div>
        }


      </div>
    );
  }
}

export default withStyles(s)(GcCasualtyList);
