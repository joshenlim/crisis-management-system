import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IncidentCard.scss';
import expandIcon from '../../assets/images/expand.svg';

import Enum from '../../constants/enum';
import formatUtils from '../../formatUtils';

class IncidentCard extends React.Component {
  static propTypes = {
    iconType: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = { incident: [] };
    this.expandIncident = this.expandIncident.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  //TODO - Provide ID for mountModal
  expandIncident = () => {
    console.log('Expand event');
    this.props.mountModal(Enum.detailType.INCIDENT, this.state.incident.id);
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
    this.state.incident = incident;

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
          incident.status != "CLOSED" && <div className={`${s.status} ${statusClass}`}>{incident.status}</div>
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
