import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertedIncidentDesc.scss';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';

import formatUtils from '../../../formatUtils';
import Enum from '../../../constants/enum';

import { SOCKIO_HOST } from '../../../constants';
import Socket from 'socket.io-client';

import deleteIcon from '../../../assets/images/close.svg';

var io = Socket(SOCKIO_HOST);

class AlertedIncidentDesc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ceDesc: [],
      desc: '',
      updateBtnState: { class: s.updateBtnDisabled, text: 'Update', user: {} },
    };
  }

  componentWillMount() {
    this.fetchCurrentUser();
    this.fetchCEDesc();

    io.on('fetch', type => {
      if (Enum.socketEvents.CE_DESCRIPTION == type) {
        this.fetchCEDesc();
        console.log(
          'SocketIo: received "ce description" at ' +
            new Date().getTime() +
            'ms',
        );
      }
    });
  }

  fetchCurrentUser = () => {
    fetch(API_HOST + 'api/auth/details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => this.setState({ user: data }))
      .catch(err => console.log(err));
  };

  fetchCEDesc = () => {
    fetch(
      API_HOST +
        'api/incident/get_ce_desc?incident_id=' +
        this.props.incidentId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => this.setState({ ceDesc: data.reverse() }))
      .catch(err => console.log(err));
  };

  addCEDesc = () => {
    if (this.state.desc != '')
      fetch(API_HOST + 'api/incident/add_ce_desc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ce_incident_id: this.props.incidentId,
          description: this.state.desc,
        }),
      })
        .then(res => res.json())
        .then(() => {
          this.setState({
            updateBtnState: {
              class: s.updateBtnDisabled,
              text: 'Update',
            },
            desc: '',
          });
          io.emit('notify', Enum.socketEvents.CE_DESCRIPTION);
          console.log(
            'SocketIo: emitted "ce description" at ' +
              new Date().getTime() +
              'ms',
          );
        })
        .catch(err => console.log(err));
  };

  removeCEDesc = ceid => {
    fetch(API_HOST + 'api/incident/remove_ce_desc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ce_desc_id: ceid,
      }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Incident update removed.');

        io.emit('notify', Enum.socketEvents.CE_DESCRIPTION);
        console.log(
          'SocketIo: emitted "ce description" at ' +
            new Date().getTime() +
            'ms',
        );
      })
      .catch(err => console.log(err));
  };

  updateOnchange = ev => {
    this.setState({ desc: ev.target.value });

    if (ev.target.value == '') {
      this.setState({
        updateBtnState: {
          class: s.updateBtnDisabled,
          text: 'Update',
        },
      });
    } else {
      this.setState({
        updateBtnState: {
          class: s.updateBtn,
          text: 'Update',
        },
      });
    }
  };

  updateOnclick = ev => {
    if (this.state.updateBtnState.class === s.updateBtn) {
      this.setState({
        updateBtnState: {
          class: s.updateBtnDisabled,
          text: 'Updating...',
        },
      });

      this.addCEDesc();
    }
  };

  removeBtnOnclick = ceid => {
    if (
      confirm(
        'You are about to remove an incident update.\nDo you want to continue?',
      )
    ) {
      this.removeCEDesc(ceid);
    }
  };

  renderDelBtn = (ceid, sid) => {
    if (this.state.user.id === sid) {
      return (
        <img
          onClick={() => {
            this.removeBtnOnclick(ceid);
          }}
          className={s.removeBtn}
          src={deleteIcon}
        />
      );
    }
  };

  renderDesc = () => {
    if (this.state.ceDesc.length > 0) {
      return (
        <div className={s.list}>
          {this.state.ceDesc.map(desc => (
            <div className={s.card}>
              {this.renderDelBtn(desc.id, desc.specialist_id)}
              <p>{desc.description}</p>
              <p className={s.stamp}>
                {desc.name} - {formatUtils.formatDate(desc.created_at)}
              </p>
            </div>
          ))}
        </div>
      );
    } else {
      return <p className={s.tips}>There are currently no updates.</p>;
    }
  };

  render() {
    const { user } = this.props;

    return (
      <div className={s.container}>
        <b>Incident logs</b> <br />
        {user.role_id != 5 &&
          this.props.incidentStatus !== Enum.incidentStatus.CLOSED && (
            <div className={s.inputPanel}>
              <textarea
                className={s.textarea}
                placeholder="Enter updates here."
                onChange={this.updateOnchange}
                value={this.state.desc}
              />

              <div
                onClick={this.updateOnclick}
                className={this.state.updateBtnState.class}
              >
                {this.state.updateBtnState.text}
              </div>
            </div>
          )}
        <div className={s.descPanel}>{this.renderDesc()}</div>
      </div>
    );
  }
}

export default withStyles(s)(AlertedIncidentDesc);
