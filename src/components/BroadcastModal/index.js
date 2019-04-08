import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Socket from 'socket.io-client';
import s from './BroadcastModal.scss';
import closeBtn from '../../assets/images/close.svg';
import loading from '../../assets/images/loading-2.svg';
import formatUtils from '../../formatUtils';
import { SOCKIO_HOST } from '../../constants';
import axios from 'axios';

const io = Socket(SOCKIO_HOST);

class BroadcastModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      updatingIncident: false,
      statusClass: '',
      message: '',

      emailTitle: `ALERT: ${formatUtils.formatCategoryName(
        this.props.incident.category,
      )} (${formatUtils.formatAbbrev(this.props.incident.category)} - ${
        this.props.incident.id
      })`,

      emailMsg: `Please be informed about the following incident: ${formatUtils.formatCategoryName(
        this.props.incident.category,
      )} (${formatUtils.formatAbbrev(this.props.incident.category)} - ${
        this.props.incident.id
      })\n\nIncident was first reported at ${formatUtils.formatDate(
        this.props.incident.created_at,
      )} and occured at ${this.props.incident.address} (${
        this.props.incident.postal_code
      }). There are a total of ${
        this.props.incident.casualty_no
      } casualties\n\nIncident Description:\n${
        this.props.incident.description
      }\n\nDo log into the SGFront System to stay updated on this emergency incident.`,

      publicMsg: `PUBLIC WARNING: ${formatUtils.formatCategoryName(
        this.props.incident.category,
      )} at ${this.props.incident.address} (${
        this.props.incident.postal_code
      }). Do avoid that area for until further notice.`,
    };
  }

  closeModal = () => this.props.mountModal();
  disableCloseModal = event => event.stopPropagation();
  onEmailTitleChange = event =>
    this.setState({ emailTitle: event.target.value });
  onEmailMessageChange = event =>
    this.setState({ emailMsg: event.target.value });
  onPublicMessageChange = event =>
    this.setState({ publicMsg: event.target.value });

  broadcastMsg = () => {
    const { emailTitle, emailMsg, publicMsg } = this.state;
    switch (this.props.type) {
      case 'sms': {
        axios
          .post('/api/sms/broadcast', {
            message: publicMsg,
          })
          .then()
          .catch(err => console.log(err));
        break;
      }
      case 'email': {
        axios
          .post('/api/email/send', {
            title: emailTitle,
            message: emailMsg,
          })
          .then()
          .catch(err => console.log(err));
        break;
      }
      case 'social': {
        axios
          .post('/api/twitter/tweet', {
            message: publicMsg,
          })
          .then()
          .catch(err => console.log(err));
        break;
      }
    }
    console.log('broadcast type:', this.props.type);
  };

  renderContent = () => {
    switch (this.props.type) {
      case 'sms':
        return (
          <div className={s.broadcastModal}>
            <p className={s.contentHeader}>Warning SMS</p>
            <div className={s.contentBody}>
              <p className={s.desc}>
                Enter the message to broadcast to the public
              </p>
              <div className={s.textQuestion + ' ' + s.textArea}>
                <div className={s.question}>
                  <p className={s.title}>Broadcast Message:</p>
                </div>
                <textarea
                  className={s.textInput}
                  name="broadcast_message"
                  rows={10}
                  cols={40}
                  value={this.state.publicMsg}
                  onChange={this.onPublicMessageChange}
                />
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className={s.broadcastModal}>
            <p className={s.contentHeader}>Email Alert</p>
            <div className={s.contentBody}>
              <p className={s.desc}>
                Enter the title and message to alert the relevant Ministries
              </p>
              <div className={s.textQuestion}>
                <div className={s.question}>
                  <p className={s.title}>Email Title:</p>
                </div>
                <input
                  className={s.textInput}
                  name="broadcast_title"
                  type="text"
                  value={this.state.emailTitle}
                  onChange={this.onEmailTitleChange}
                />
              </div>
              <div className={s.textQuestion + ' ' + s.textArea}>
                <div className={s.question}>
                  <p className={s.title}>Broadcast Message:</p>
                </div>
                <textarea
                  className={s.textInput}
                  name="broadcast_message"
                  rows={10}
                  cols={40}
                  value={this.state.emailMsg}
                  onChange={this.onEmailMessageChange}
                />
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className={s.broadcastModal}>
            <p className={s.contentHeader}>Social Media (Twitter)</p>
            <div className={s.contentBody}>
              <p className={s.desc}>
                Enter the message to broadcast to SGFront's Twitter Feed
              </p>
              <div className={s.textQuestion + ' ' + s.textArea}>
                <div className={s.question}>
                  <p className={s.title}>Broadcast Message:</p>
                </div>
                <textarea
                  className={s.textInput}
                  name="broadcast_message"
                  rows={10}
                  cols={40}
                  value={this.state.publicMsg}
                  onChange={this.onPublicMessageChange}
                />
              </div>
            </div>
          </div>
        );
      default:
        this.closeModal();
    }
  };

  render() {
    const { page, updatingIncident, message } = this.state;
    return (
      <div className={s.modalBackground} onClick={this.closeModal}>
        <div
          className={
            s.modal +
            ' ' +
            (page == 2 && s.dispatchMapStep) +
            ' ' +
            (page == 0 && s.submitStep)
          }
          onClick={this.disableCloseModal}
        >
          {page != 0 && (
            <span className={s.closeBtn} onClick={this.closeModal}>
              <img src={closeBtn} alt="close" />
            </span>
          )}

          {!updatingIncident && page != 0 && this.renderContent()}

          {!updatingIncident && page != 0 && (
            <div className={s.btnGrp}>
              <div className={s.button} onClick={this.broadcastMsg}>
                Send Broadcast
              </div>
            </div>
          )}

          {updatingIncident && (
            <div className={s.loadingWindow}>
              <img className={s.loadingIcon} src={loading} alt="loading" />
              <p>{message}</p>
            </div>
          )}

          {!updatingIncident && page == 0 && (
            <div className={s.successWindow}>
              <div className={s.checkIcon}>
                <span className={s.iconLine + ' ' + s.lineTip} />
                <span className={s.iconLine + ' ' + s.lineLong} />
                <div className={s.iconCircle} />
                <div className={s.iconFix} />
              </div>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(BroadcastModal);
