import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './GcDashboard.scss';
import logo from '../../assets/images/logo-light.svg'
import formatUtils from '../../formatUtils';

class GcProfile extends React.Component {
  render() {
    const { user, gcProfile, activeIncident, loading } = this.props;

    return (
      <div className={s.cardBody}>
        <div className={s.header}>
          <img className={s.logo} src={logo} alt="logo" />
          <div className={s.title}>
            <p>Ground Commander</p>
            <p>Management Interface</p>
          </div>
        </div>

        <div className={s.user}>
          <p>Logged in as: {user.rank} {user.name}</p>
          <p>Station: {gcProfile.fire_station_name}</p>
          <p>Vehicle Number: {gcProfile.veh_plate_num} ({gcProfile.call_sign})</p>
        </div>

        {
          loading && <div className={s.incidentIdInput}>
            <p className={s.notifMsg}>Retrieving data...</p>
          </div>
        }

        {
          !loading && activeIncident.length == 0 && <div className={s.incidentIdInput}>
            <p className={s.notifMsg}>No Active Case Assigned</p>
          </div>
        }
        
        {
          !loading && activeIncident.length > 0 && <div className={s.incidentIdInput}>
            <p>Active Case:</p>
            <p>{formatUtils.formatAbbrev(activeIncident[0].category)}-{activeIncident[0].id}</p>
            <div className={s.nextButton} onClick={this.props.expandIncidentDetail}></div>
          </div>
        }
        
        <p className={s.logout} onClick={this.props.logout}>Log out</p>
      </div>
    );
  }
}

export default withStyles(s)(GcProfile);
