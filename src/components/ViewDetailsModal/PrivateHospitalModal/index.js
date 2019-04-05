import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

class PublicHospitalModal extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hospital: {},
    };
  }

  fetchPublicHospital = () => {
    fetch(API_HOST + 'api/hospitals/get_hospital_id?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ hospital: data[0] }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchPublicHospital();
  }
  
  render() {
    const { hospital } = this.state;
    return Object.keys(hospital).length != 0 && (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            {hospital.name} (Private)
          </p>
        </div>

        <hr />

        <p className={s.contentHeader}>Hospital Details</p>
        <div className={s.contentBody}>
          <table>
            <tbody>
              <tr>
                <td className={s.detailHeader}>Address: </td>
                <td>{hospital.address}</td>
              </tr>
              <tr>
                <td className={s.detailHeader}>Postal Code: </td>
                <td>{hospital.postal_code}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(PublicHospitalModal);
