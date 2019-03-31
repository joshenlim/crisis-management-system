import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';

class HospitalModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      callsign: '',
      name: '',
      postalCode: '',
      address: '',
    };
  }

  componentWillMount() {
    //TODO - AJAX to API for selecting fire station details with this.props.id
    this.state.callsign = 'FS001';
    this.state.name = 'Sengkang Fire Department';
    this.state.postalCode = 'S820193';
    this.state.address = 'Sengkang Ave 1 #01-231';
  }

  render() {
    return (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            {this.state.callsign} - {this.state.name}
          </p>
        </div>

        <hr />
        <p className={s.contentHeader}>Vehicle Status</p>
        <table>
          <thead>
            <tr>
              <td className={s.contentHeader}>Callsign</td>
              <td className={s.contentHeader}>Type</td>
              <td className={s.contentHeader}>On Call</td>
              <td className={s.contentHeader}>Case Attached</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(s)(HospitalModal);
