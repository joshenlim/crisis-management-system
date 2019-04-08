import React from 'react';
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import throttle from 'lodash.throttle';
import axios from 'axios';

import s from './GcDashboard.scss';
import { API_HOST } from '../../constants';
import Enum from '../../constants/enum';

import GcProfile from './GcProfile';
import GcIncidentDetail from './GcIncidentDetail';
import GcAddCasualty from './GcAddCasualty';
import GcCasualtyList from './GcCasualtyList';

@connect(state => ({
  user: state.user,
}))
class GcDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gcProfile: {},
      activeIncident: [],
      loading: true,
      page: 1,
      vehStatus: "",
      showMsg: false,
    }
    this.handleClickThrottled = throttle(this.logout, 1000);
  }

  componentDidMount = () => {
    fetch(API_HOST + 'api/auth/gc_details?id=' + this.props.user.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const profile = data[0]
        this.setState({ gcProfile: profile })
        fetch(API_HOST + 'api/incident/get_gc_active_incident?plate=' + profile.veh_plate_num, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(data => this.setState({
            activeIncident: data,
            loading: false,
            vehStatus: data.length > 0 ? data[0].veh_status : "",
          }))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  logout = event => {
    if (this.props.onClick) this.props.onClick(event);
    const originURL = window.location.origin;
    axios.post(`${originURL}/logout`).then((window.location = originURL));
  };

  expandIncidentDetail = () => {
    this.setState({ page: 2 });
  }

  viewGCProfile = () => {
    this.setState({ page: 1 });
  }

  addCasualty = () => {
    this.setState({ page: 3 });
  }

  viewCasualty = () => {
    this.setState({ page: 4 });
  }

  reportOnsite = () => {
    this.setState({ vehStatus: Enum.vehicleStatus.ON_SITE })
    const body = {
      status: Enum.vehicleStatus.ON_SITE,
      incident_id: this.state.activeIncident[0].id,
      plate_number: this.state.gcProfile.veh_plate_num,
    }
    axios.post('/api/incident/update_gc_veh_status', body)
      .then(res => res)
      .catch(err => {
        console.log(err);
      });
  }

  reportEnroute = () => {
    this.setState({ vehStatus: Enum.vehicleStatus.ENROUTE_BACK })
    const body = {
      status: Enum.vehicleStatus.ENROUTE_BACK,
      incident_id: this.state.activeIncident[0].id,
      plate_number: this.state.gcProfile.veh_plate_num,
    }
    axios.post('/api/incident/update_gc_veh_status', body)
      .then(res => res)
      .catch(err => {
        console.log(err);
      });
  }

  reportReturned = () => {
    this.setState({ vehStatus: "" })
    const body = {
      status: Enum.vehicleStatus.RETURNED,
      incident_id: this.state.activeIncident[0].id,
      plate_number: this.state.gcProfile.veh_plate_num,
    }
    axios.post('/api/incident/update_gc_veh_status', body)
      .then(() => {
        this.setState({
          page: 1,
          activeIncident: [],
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  addCasualtyInfo = (casualtyInfo) => {
    const body = {
      ...casualtyInfo,
      incident_id: this.state.activeIncident[0].id,
    }
    this.setState({ showMsg: true, page: 2 });
    setTimeout(() => {
      this.setState({ showMsg: false });
    }, 2000);
    axios.post('/api/incident/add_casualty_info', body)
      .then(res => res)
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { user } = this.props;
    const { gcProfile, activeIncident, loading, page, vehStatus, showMsg } = this.state;

    return (
      <div className={s.container}>
        <div className={s.view + " " + (showMsg && s.expandMsg)}>

          <div className={s.success}>
            <p>Casualty successfully added!</p>  
          </div>

          <div className={s.card + " " + (page > 1 && s.expandCard)}>

            {
              page == 1 && <GcProfile user={user}
                gcProfile={gcProfile}
                activeIncident={activeIncident}
                loading={loading}
                expandIncidentDetail={this.expandIncidentDetail}
                logout={this.handleClickThrottled}
              />
            }

            {
              page == 2 && <GcIncidentDetail 
                incident={activeIncident[0]}
                prevPage={this.viewGCProfile}
                reportOnsite={this.reportOnsite}
                reportEnroute={this.reportEnroute}
                reportReturned={this.reportReturned}
                vehStatus={vehStatus}
                addCasualty={this.addCasualty}
                viewCasualty={this.viewCasualty}
              />
            }

            {
              page == 3 && <GcAddCasualty 
                incident={activeIncident[0]}
                prevPage={this.expandIncidentDetail}
                hospitalList={this.props.hospitalList}
                addCasualtyInfo={this.addCasualtyInfo}
              />
            }

            {
              page == 4 && <GcCasualtyList 
                incident={activeIncident[0]}
                prevPage={this.expandIncidentDetail}
                hospitalList={this.props.hospitalList}
                addCasualtyInfo={this.addCasualtyInfo}
              />
            }

          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(GcDashboard);
