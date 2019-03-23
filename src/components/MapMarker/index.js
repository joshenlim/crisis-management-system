import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Enum from '../../constants/enum';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MapMarker.scss';

import FIcon from '../../assets/images/mapicon-firestation.svg';
import IIcon from '../../assets/images/mapicon-incident.svg';
import PubHIcon from '../../assets/images/mapicon-pubhospital.svg';
import PriHIcon from '../../assets/images/mapicon-prihospital.svg';

class MapMarker extends Component {
  static propTypes = {
    iconType: PropTypes.number.isRequired,
    color: PropTypes.string,
    mountModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { showBubble: false, svg: {}, iconAlt: '' };

    this.mountBubble = this.mountBubble.bind(this);
    this.mountModal = this.mountModal.bind(this);
  }

  componentWillMount() {
    switch (this.props.iconType) {
      case Enum.detailType.FIRE_STATION:
        // this.setState({ svg: FIcon, iconAlt: 'firestation' });
        this.state.svg = FIcon;
        this.state.iconAlt = 'firestation';
        break;
      case Enum.detailType.PUBLIC_HOSPITAL:
        // this.setState({ svg: PubHIcon, iconAlt: 'public hospital' });
        this.state.svg = PubHIcon;
        this.state.iconAlt = "'public hospital";
        break;
      case Enum.detailType.PRIVATE_HOSPITAL:
        // this.setState({ svg: PriHIcon, iconAlt: 'private hospital' });
        this.state.svg = PriHIcon;
        this.state.iconAlt = 'private hospital';
        break;
      case Enum.detailType.INCIDENT:
        // this.setState({ svg: IIcon, iconAlt: 'incident' });
        this.state.svg = IIcon;
        this.state.iconAlt = 'incident';
        break;
      default:
        this.state.svg = IIcon;
        this.state.iconAlt = 'incident';
    }
  }

  mountBubble(event) {
    if (event.type === 'mouseenter') {
      this.setState({ showBubble: true });
    }
    if (event.type === 'mouseleave') {
      this.setState({ showBubble: false });
    }
  }

  //TODO - Insert assigned ID for mountModal
  mountModal() {
    this.props.mountModal(this.props.iconType, '');
  }

  render() {
    return (
      <div className={s.bubble}>
        <span className={s.bubbleBody}>
          <p className={s.bubbleTitle}>{this.props.title}</p>
          <p className={s.bubbleText}>{this.props.text}</p>
        </span>
        <img
          className={s.icon}
          style={{ fill: this.props.color }}
          onMouseEnter={this.mountBubble}
          onMouseLeave={this.mountBubble}
          onClick={this.mountModal}
          src={this.state.svg}
          alt={this.state.iconAlt}
        />
      </div>
    );
  }
}

export default withStyles(s)(MapMarker);
