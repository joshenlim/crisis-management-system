import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TimeWeatherTemp.scss';
import weatherIcon from '../../assets/images/weather-clear.svg';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
    };
  }

  componentWillMount() {
    this.startTime();
  }

  checkTime = (i) => {
    if (i < 10) { i = "0" + i };
    return i;
  }

  startTime = () => {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.setState({
      time: h + " : " + m + " : " + s,
    })
    let t = setTimeout(this.startTime, 500);
  }

  render() {
    const { time } = this.state;
    return (
      <div className={s.navBar}>
        <div className={s.time}>{time}</div>
        <div className={s.temp}>27°C</div>
        <div className={s.weather}>
          <img className={s.icon} alt="weather" src={weatherIcon} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NavBar);
