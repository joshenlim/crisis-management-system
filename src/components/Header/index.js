import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import throttle from 'lodash.throttle';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import logo from '../../assets/images/logo-light.svg';
import logoAlt from '../../assets/images/logo-dark.svg';
import Enum from '../../constants/enum';

class Header extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);
    const originURL = window.location.origin;
    axios.post(`${originURL}/logout`).then((window.location = originURL));
  };

  handleOnKeyDown = event => {
    event.preventDefault();
  };

  render() {
    const { user } = this.props;
    const mockProfile =
      'https://az616578.vo.msecnd.net/files/2016/07/24/6360498492827782071652557381_corgi%20header.jpg';
    const userProfileStyle = {
      backgroundImage: `url(${mockProfile})`,
    };

    let logoSrc, cssHeader, cssProfile, cssLogout, dashboardTitle;
    switch (user.role) {
      case Enum.staffRole.SPECIALIST:
        cssHeader = s.headerHQ;
        logoSrc = logoAlt;
        cssProfile = s.userProfileHQ;
        cssLogout = s.logoutHQ;
        dashboardTitle = "HQ"
        break;
      case Enum.staffRole.RELATIONS_OFFICER:
        cssHeader = s.headerPMO;
        logoSrc = logoAlt;
        cssProfile = s.userProfilePMO;
        cssLogout = s.logoutPMO;
        dashboardTitle = "PMO"
        break;
      default:
        cssHeader = s.headerOps;
        logoSrc = logo;
        cssProfile = s.userProfileOps;
        cssLogout = s.logoutOps;
        dashboardTitle = ""
    }

    return (
      <div className={cssHeader}>
        { user.role == Enum.staffRole.RELATIONS_OFFICER && <div className={s.blueStrip}></div> }
        <div className={s.logo}>
          <img className={s.logoImg} alt="Logo" src={logoSrc} />
          <div className={s.title}>{dashboardTitle}</div>
        </div>
        <div className={s.nav}>
          <div className={s.userProfile + ' ' + cssProfile}>
            <div className={s.userInfo}>
              <div className={s.name}>
                {user.rank} {user.name}
              </div>
              <div className={s.role}>{user.role}</div>
            </div>
            <div className={s.image} style={userProfileStyle} />
          </div>
          <div
            className={s.logout + ' ' + cssLogout}
            onClick={this.handleClickThrottled}
            onKeyDown={this.handleOnKeyDown}
            role="button"
            tabIndex={0}
          >
            Log out
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
