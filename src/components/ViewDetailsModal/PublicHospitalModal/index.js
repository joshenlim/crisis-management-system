import React, { Component } from 'react';
import fetch from 'node-fetch';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewDetailsModal.scss';
import Enum from '../../../constants/enum';

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
      name: '',
      postalCode: '',
      address: '',
      hospitals: [],
    };
  }

  fetchPublicHospital = () => {
    fetch(API_HOST + 'api/hospitals/get_public_hospital?id=1', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ hospitals: data.reverse() }))
      .catch(err => console.log(err));
  }

  componentWillMount() {
    //TODO - AJAX to API for selecting hospital details with this.props.id
    this.fetchPublicHospital();
    for(var i=0;i<this.state.hospitals.length;i++)
    {
      this.state.name = this.state.hospitals[i].name;
      this.state.postalCode = this.state.hospitals[i].postal_code;
      this.state.address = this.state.hospitals[i].address;
    }
  }

  render() {
    return (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            Hospital Details
          </p>
        </div>

        <hr />
        <p className={s.contentHeader}>{this.state.name}</p>
        <table>
          <thead>
            <tr>
              <td className={s.contentHeader}>{this.state.postalCode}</td>
              <td className={s.contentHeader}>{this.state.address}</td>
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

export default withStyles(s)(PublicHospitalModal);
