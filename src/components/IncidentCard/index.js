import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IncidentCard.scss';
import expandIcon from '../../assets/images/expand.svg';

class IncidentCard extends React.Component {
  static propTypes = {
    incident: PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
    mountModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.expandIncident = this.expandIncident.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  expandIncident = () => {
    console.log('Expand event');
    this.props.mountModal();
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
      <div className={s.incidentCard}>
        <div className={s.segment}>
          <p className={s.caseNo}>Case No: {incident.id}</p>
          <div
            className={s.expandBtn}
            onClick={this.expandIncident}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}
            incidentId={incident.id}
          >
            <img src={expandIcon} alt="expand" />
          </div>
        </div>
        <p className={s.category}>{incident.category}</p>
        <p className={s.location}>
          {incident.postalCode}, {incident.address}
        </p>
        <div className={`${s.status} ${statusClass}`}>{incident.status}</div>
      </div>
    );
  }
}

export default withStyles(s)(IncidentCard);
