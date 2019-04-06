import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertedIncidentCard.scss';

import logoTraffic from '../../../assets/images/alerted-traffic.svg';
import logoAmbulance from '../../../assets/images/alerted-ambulance.svg';
import logoFireVeh from '../../../assets/images/alerted-fireveh.svg';
import logoTank from '../../../assets/images/alerted-tank.svg';

import nextBtn from '../../../assets/images/next.svg';

import Enum from '../../../constants/enum';
import formatUtils from '../../../formatUtils';

class AlertedIncidentCard extends Component {
  //TODO - Update proptype
  static propTypes = {
    incident: PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { incident: this.props.incident };

    this.renderLogo = this.renderLogo.bind(this);
  }

  renderLogo() {
    switch (formatUtils.formatCategoryName(this.state.incident.category)) {
      case Enum.incidentCategory.TRAFFIC:
        return logoTraffic;
      case Enum.incidentCategory.MEDICAL:
        return logoAmbulance;
      case Enum.incidentCategory.GAS:
        return logoTank;
      case Enum.incidentCategory.FIRE:
        return logoFireVeh;
    }
  }

  displayDetail = () => {
    this.props.displayDetail(this.props.incident.id);
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
      <div className={s.incidentCard} onClick={this.displayDetail}>
        <div className={s.incidentCardContent}>
          <div className={s.icon}>
            <img src={this.renderLogo()} />
          </div>
          <div>
            <p className={s.nonEmphasis}>Case No: {incident.id}</p>
            <div
              className={s.expandBtn}
              onClick={this.expandIncident}
              onKeyDown={this.handleOnKeyDown}
              role="button"
              tabIndex={0}
              incidentid={incident.id}
            />

            <p className={s.category}>Category: {formatUtils.formatCategoryName(incident.category)}</p>
            <p className={s.location}>
              Location: {incident.postal_code}, {incident.address}
            </p>
            <div className={s.statusDate}>
              <div className={s.nonEmphasis}>Opened: {formatUtils.formatDate(incident.created_at)}</div>
              &emsp;&emsp;
              <div className={`${s.status} ${statusClass}`}>
                {incident.status}
              </div>
            </div>
          </div>
        </div>
        <div className={s.nextBtn}>
          <img src={nextBtn} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentCard);
