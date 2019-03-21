import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';

class IncidentModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      category: '',
      postalCode: '',
      address: '',
      status: '',
      description: '',
    };
  }

  componentWillMount() {
    //TODO - AJAX to API for selecting incident with this.props.id
    this.state.id = 'SNB-1045-367X';
    this.state.category = 'Emergency Ambulance';
    this.state.postalCode = 'S820193';
    this.state.address = '#01-231';
    this.state.status = 'DISPATCHED';
    this.state.description =
      'Traffic accident involving 3 vehicles on the Pan-Island Expressway (PIE) 2 injured but no fatality, consectetur adipiscing elit. Suspendisse metus ipsum, feugiat id nisi non, laoreet facilisis nunc. Cras et pellentesque est, a pulvinar turpis. Quisque laoreet tellus nulla, sit amet varius mauris porta sodales.';
  }

  render() {
    var statusClass = '';
    switch (this.state.status) {
      case Enum.incidentStatus.DISPATCHED:
        statusClass = s.dispatched;
        break;
      case Enum.incidentStatus.ON_SITE:
        statusClass = s.onsite;
        break;
      case Enum.incidentStatus.ENROUTE:
        statusClass = s.enrouteBack;
        break;
      default:
        statusClass = s.dispatched;
    }

    return (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            {this.state.category} - {this.state.postalCode},{' '}
            {this.state.address}
          </p>
        </div>
        <div className={s.caseNo}>Case No: {this.state.id} </div> &ensp;
        <div className={`${s.status} ${statusClass}`}>{this.state.status}</div>
        <hr />
        <p className={s.contentHeader}>Incident Description</p>
        <div className={s.contentBody}>{this.state.description}</div>
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
                  {this.state.postalCode}, {this.state.address}
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
    );
  }
}

export default withStyles(s)(IncidentModal);
