import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Enum from '../../constants/enum';
import formatUtils from '../../formatUtils';
import s from './GcDashboard.scss';
import arrow from '../../assets/images/down-arrow.svg'
import GcStaticMap from './GcStaticMap';

class GcProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  reportOnsite = () => {
    if (confirm("Confirm reaching incident location?")) {
      this.props.reportOnsite();
    }
  }

  reportEnroute = () => {
    if (confirm("Confirm leaving incident location?")) {
      this.props.reportEnroute();
    }
  }

  reportReturned = () => {
    if (confirm("Confirm arrival back at station?")) {
      this.props.reportReturned();
    }
  }

  addCasualty = () => {
    this.props.addCasualty();
  }

  viewCasualty = () => {
    this.props.viewCasualty();
  }

  render() {
    const { incident, vehStatus } = this.props;
    let statusStyle = s.vehOtw;

    switch(vehStatus) {
      case Enum.vehicleStatus.ON_THE_WAY:
        statusStyle = s.vehOtw;
        break;
      case Enum.vehicleStatus.ON_SITE:
        statusStyle = s.vehOnSite;
        break;
      case Enum.vehicleStatus.ENROUTE_BACK:
        statusStyle = s.vehEnroute;
        break;
      case Enum.vehicleStatus.RETURNED:
        statusStyle = s.vehReturned;
        break;
      default:
        statusStyle = s.vehOtw;
        break;
    }

    return (
      <div className={s.incidentDetail}>
        <p className={s.backBtn} onClick={this.props.prevPage}>
          <span><img src={arrow}/></span>
          Back
        </p>

        <div className={s.header}>
          <div className={s.incidentDetail}>
            <p className={s.caseNo}>Case No: {formatUtils.formatAbbrev(incident.category)} - {incident.id}</p>
            <p className={s.category}>{formatUtils.formatCategoryName(incident.category)}</p>
          </div>
          <div className={s.vehStatus}>
            <div className={s.status + " " + statusStyle}>
              <p className={s.statusTitle}>Status:</p>
              <p className={s.statusVal}>{vehStatus}</p>
            </div>
          </div>
        </div>

        <table className={s.incidentTable}>
          <tr>
            <td className={s.contentHeader}>Created At:</td>
            <td className={s.contentBody}>{formatUtils.formatDate(incident.created_at)}</td>
          </tr>
          <tr>
            <td className={s.contentHeader}>Incident Location:</td>
            <td className={s.contentBody}>{incident.address}, {incident.postal_code}</td>
          </tr>
          <tr>
            <td className={s.contentHeader}>Incident Description:</td>
            <td className={s.contentBody}>{incident.description}</td>
          </tr>
          <tr>
            <td className={s.contentHeader}>Number of Casualties:</td>
            <td className={s.contentBody}>{incident.casualty_no}</td>
          </tr>
        </table>

        <GcStaticMap
          address={incident.postal_code}
          center={{ lat: incident.lat, lng: incident.lng }}
          zoom={12}
        />

        <hr />

        <div className={s.btnGroup}>
          {
            vehStatus == Enum.vehicleStatus.ON_THE_WAY && <div className={s.statusReportBtn} onClick={this.reportOnsite}>
              Report Onsite
            </div>
          }
          {
            vehStatus == Enum.vehicleStatus.ON_SITE && <div className={s.statusReportBtn} onClick={this.addCasualty}>
              Add Casualty Information
            </div>
          }
          {
            (vehStatus == Enum.vehicleStatus.ENROUTE_BACK || vehStatus == Enum.vehicleStatus.ON_SITE) && <div className={s.statusReportBtn} onClick={this.viewCasualty}>
              View Casualty Information
            </div>
          }
          {
            vehStatus == Enum.vehicleStatus.ON_SITE &&<div className={s.statusReportBtn} onClick={this.reportEnroute}>
              Report Enroute
            </div>
          }
          {
            vehStatus == Enum.vehicleStatus.ENROUTE_BACK &&<div className={s.statusReportBtn} onClick={this.reportReturned}>
              Report Returned
            </div>
          }
        </div>

      </div>
    );
  }
}

export default withStyles(s)(GcProfile);
