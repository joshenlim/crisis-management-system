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
      name: '',
      postal_code: '',
      address: '',
      hospitals: [],
    };
  }

  fetchPublicHospital = () => {
    fetch(API_HOST + 'api/hospitals/get_hospital_id?id='+this.props.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ hospitals: data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    //TODO - AJAX to API for selecting hospital details with this.props.id
    this.fetchPublicHospital();

    this.state.name = this.state.hospitals.name;
    this.state.postal_code = this.state.hospitals.postal_code;
    this.state.address = this.state.hospitals.address;
  }
  
  render() {
    const { hospitals } = this.state;

    return (
      <div>
        <div className={s.segment}>
          <p className={s.category}>
            Hospital Details
          </p>
        </div>
   
        <hr />
        <p className={s.contentHeader}>
        {hospitals.map(hospital =>
          <p>Name: {hospital.name} <br/>
          Postal Code: {hospital.postal_code} <br/>
          Address: {hospital.address}</p>
        )}
        </p>
        <table>
          <thead>
            <tr>
              <td className={s.contentHeader}></td>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className={s.contentHeader}></td>
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
