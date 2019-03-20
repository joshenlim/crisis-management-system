import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IncidentDetailsModal.scss';
import closeBtn from '../../assets/images/close.svg';

class IncidentDetailsModal extends React.Component {
  static propTypes = {
    incident: PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    mountModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      statusClass: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.disableCloseModal = this.disableCloseModal.bind(this);
  }

  closeModal(event) {
    console.log(event);
    this.props.mountModal();
  }

  disableCloseModal(event) {
    event.stopPropagation();
  }

  render() {
    const { incident } = this.props;

    switch (incident.status) {
      case 'DISPATCHED':
        this.state.statusClass = s.dispatched;
        break;
      case 'ON-SITE':
        this.state.statusClass = s.onsite;
        break;
      case 'ENROUTE BACK':
        this.state.statusClass = s.enrouteBack;
        break;
      default:
        this.state.statusClass = s.dispatched;
    }

    return (
      <div className={s.modalBackground} onClick={this.closeModal}>
        <div className={s.incidentModal} onClick={this.disableCloseModal}>
          <span className={s.closeBtn} onClick={this.closeModal}>
            <img src={closeBtn} alt="close" />
          </span>
          <div className={s.segment}>
            <p className={s.category}>
              {incident.category} - {incident.postalCode}, {incident.address}
            </p>
          </div>
          <div className={s.caseNo}>Case No: {incident.id} </div> &ensp;
          <div className={`${s.status} ${this.state.statusClass}`}>
            {incident.status}
          </div>
          <hr />
          <p className={s.contentHeader}>Incident Description</p>
          <div className={s.contentBody}>
            {incident.description}
          </div>
          <p className={s.contentHeader}>Incident Details</p>
          <div className={s.contentBody}>
            <table>
              <tbody>
                <tr>
                  <td className={s.detailHeader}>Time of Call: </td>
                  <td>12:30:32</td>
                </tr>
                <tr>
                  <td className={s.detailHeader}>Vehicle Plate Number: </td>
                  <td>SXX0000X, SXX0000X, SXX0000X</td>
                </tr>
                <tr>
                  <td className={s.detailHeader}>Incident Location: </td>
                  <td>
                    {incident.postalCode}, {incident.address}
                  </td>
                </tr>
                <tr>
                  <td className={s.detailHeader}>Caller Information: </td>
                  <td>Lim Ah Choo, 94567293</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={s.contentHeader}>Dispatchment Details</p>
          <div>Sengkang Fire Station</div>
          <div />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(IncidentDetailsModal);
