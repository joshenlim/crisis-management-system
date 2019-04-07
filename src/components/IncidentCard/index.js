import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IncidentCard.scss';
import expandIcon from '../../assets/images/expand.svg';
import escalateIcon from '../../assets/images/escalate.svg';

import Enum from '../../constants/enum';
import formatUtils from '../../formatUtils';

class IncidentCard extends React.Component {
  constructor(props) {
    super(props);
    this.expandIncident = this.expandIncident.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  expandIncident = () => {
    this.props.mountModal(Enum.detailType.INCIDENT, this.props.incident.id);
  };

  handleOnKeyDown = event => {
    event.preventDefault();
  };

  render() {
    const { incident } = this.props;
    let statusClass;

    switch (incident.status) {
      case 'DISPATCHED':
        statusClass = s.dispatched;
        break;
      case 'ON-SITE':
        statusClass = s.onsite;
        break;
      case 'ENROUTE BACK':
        statusClass = s.enrouteBack;
        break;
      default:
        statusClass = s.dispatched;
    }

    return (
      <div className={s.incidentCard + " " + (incident.status == "CLOSED" && s.addMargin)}>
        <div className={s.segment}>
          <p className={s.caseNo}>Case No: {formatUtils.formatAbbrev(incident.category)}-{incident.id}</p>
          <div
            className={s.expandBtn}
            onClick={this.expandIncident}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}
            incidentid={incident.id}
          >
            <img src={expandIcon} alt="expand" />
          </div>
        </div>
        <p className={s.category}>{formatUtils.formatCategoryName(incident.category)}</p>
        <p className={s.location}>
          S{incident.postal_code}, {incident.address}
        </p>
        {
          incident.status != "CLOSED" && <div className={s.incidentStatus}>
            <div className={`${s.status} ${statusClass}`}>{incident.status}</div>
            { incident.if_escalate_hq == 1 && <img className={s.escalate} src={escalateIcon} alt="escalate" /> }
          </div>
        }
        {
          incident.status == "CLOSED" && <div className={s.timeInfo}>
            <div className={s.start}>Opened: {formatUtils.formatDate(incident.created_at)}</div>
            <div className={s.end}>Closed: {formatUtils.formatDate(incident.completed_at)}</div>
          </div>
        }
      </div>
    );
  }
}

export default withStyles(s)(IncidentCard);
