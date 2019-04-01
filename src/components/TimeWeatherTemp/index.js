import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TimeWeatherTemp.scss';
import weatherIcon from '../../assets/images/weather-clear.svg';

class NavBar extends React.Component {

  static defaultProps = {
    onClick: null,
  };

  render() {
    return (
      <div className={s.navBar}>
        <div className={s.time}>17 : 23 : 55</div>
        <div className={s.temp}>27°C</div>
        <div className={s.weather}>
          <img className={s.icon} alt="weather" src={weatherIcon} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NavBar);
