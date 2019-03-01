import React, { Component } from 'react';
import SocketIO from 'socket.io-client';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SocketTest.css';

class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: SocketIO('crisis-socket.herokuapp.com'),
      // socket: SocketIO('localhost:8080'),
      roleUI: '',
      hqNotified: 0,
      pmoNotified: 0,
    };

    this.notifyHQ = this.notifyHQ.bind(this);
    this.notifyPMO = this.notifyPMO.bind(this);
    this.updateUI = this.updateUI.bind(this);
  }

  componentDidMount() {
    this.state.socket.on('hqNotified', () => {
      this.setState({ hqNotified: this.state.hqNotified + 1 });
    });

    this.state.socket.on('pmoNotified', () => {
      this.setState({ pmoNotified: this.state.pmoNotified + 1 });
    });

    this.state.socket.on('log', array => {
      console.log(...array);
    });
  }

  notifyHQ() {
    this.state.socket.emit('notify', 'hq');
  }

  notifyPMO() {
    this.state.socket.emit('notify', 'pmo');
  }

  updateUI(e) {
    if (e.target.value === 'sender') {
      this.setState({
        roleUI: (
          <div>
            <input type="button" value="Notify HQ" onClick={this.notifyHQ} />
            <input type="button" value="Notify PMO" onClick={this.notifyPMO} />
          </div>
        ),
      });
    } else if (e.target.value === 'receiver1') {
      this.setState({
        roleUI: (
          <div>
            <h3>Notified: {this.state.hqNotified}</h3>
          </div>
        ),
      });
    } else if (e.target.value === 'receiver2') {
      this.setState({
        roleUI: (
          <div>
            <h3>Notified: {this.state.pmoNotified}</h3>
          </div>
        ),
      });
    } else {
      this.setState({ roleUI: <div /> });
    }
  }

  render() {
    return (
      <div>
        <h3>Select Role</h3>
        <table>
          <tbody>
            <tr>
              <td>Ops (Sender)</td>
              <td>
                <input
                  id="rb_sender"
                  type="radio"
                  name="role"
                  value="sender"
                  onChange={this.updateUI}
                />
              </td>
            </tr>
            <tr>
              <td>HQ (Receiver)</td>
              <td>
                <input
                  id="rb_receiver1"
                  type="radio"
                  name="role"
                  value="receiver1"
                  onChange={this.updateUI}
                />
              </td>
            </tr>
            <tr>
              <td>PMO (Receiver)</td>
              <td>
                <input
                  id="rb_receiver2"
                  type="radio"
                  name="role"
                  value="receiver2"
                  onChange={this.updateUI}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        {this.state.roleUI}
      </div>
    );
  }
}

export { Socket as SocketWithoutStyle };
export default withStyles(s)(Socket);
