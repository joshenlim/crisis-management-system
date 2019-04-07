import React from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Socket from 'socket.io-client';
import s from './BroadcastModal.scss';
import closeBtn from '../../assets/images/close.svg';
import loading from '../../assets/images/loading-2.svg';

import Enum from '../../constants/enum';
import { SOCKIO_HOST } from '../../constants';

const io = Socket(SOCKIO_HOST);

class BroadcastModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      updatingIncident: false,
      statusClass: '',
      message: '',
    };
  }

  closeModal = (event) => this.props.mountModal();
  disableCloseModal = (event) => event.stopPropagation();

  renderContent = () => {
    switch (this.props.type) {
      case "sms":
        console.log("SMS")
        return <p>SmS</p>
        // return <FireStnModal {...this.props} />;
      case "email":
        console.log("EMail")
        return <p>EMail</p>
        // return <PublicHospitalModal {...this.props} />;
      case "social":
        console.log("social")
        return <p>Social</p>
        // return <PrivateHospitalModal {...this.props} />;
      default:
        this.closeModal();
    }
  }

  render() {
    const { page, updatingIncident, message } = this.state;
    return (
      <div className={s.modalBackground} onClick={this.closeModal}>
        <div className={s.modal + " " + (page == 2 && s.dispatchMapStep) + " " + (page == 0 && s.submitStep)} onClick={this.disableCloseModal}>
          {
            page != 0 && <span className={s.closeBtn} onClick={this.closeModal}>
              <img src={closeBtn} alt="close" />
            </span>
          }
          {!updatingIncident && page != 0 && this.renderContent()}
          {
            updatingIncident && <div className={s.loadingWindow}>
              <img className={s.loadingIcon} src={loading} alt="loading" />
              <p>{message}</p>
            </div>
          }
          {
            !updatingIncident && page == 0 && <div className={s.successWindow}>
                <div className={s.checkIcon}>
                <span className={s.iconLine + " " + s.lineTip}></span>
                <span className={s.iconLine + " " + s.lineLong}></span>
                <div className={s.iconCircle}></div>
                <div className={s.iconFix}></div>
              </div>
              <p>{message}</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(BroadcastModal);
