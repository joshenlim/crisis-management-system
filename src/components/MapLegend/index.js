import React, { Component } from 'react';
import FSIcon from '../../assets/images/mapicon-firestation.svg';
import PrHIcon from '../../assets/images/mapicon-prihospital.svg';
import PuSIcon from '../../assets/images/mapicon-pubhospital.svg';
import IIcon from '../../assets/images/mapicon-incident.svg';

import s from './MapLegend.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class MapLegend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={s.legend}>
        <div className={s.iconGroup}>
          <img className={s.icon} src={FSIcon} />
          Fire Station
        </div>
        <div className={s.iconGroup}>
          <img className={s.icon} src={PrHIcon} />
          Private Hospital&emsp;
        </div>
        <div className={s.iconGroup}>
          <img className={s.icon} src={PuSIcon} />
          Public Hospital&emsp;
        </div>
        <div className={s.iconGroup}>
          <img className={s.icon} src={IIcon} />
          Incident&emsp;
        </div>
      </div>
    );
  }
}

export default withStyles(s)(MapLegend);