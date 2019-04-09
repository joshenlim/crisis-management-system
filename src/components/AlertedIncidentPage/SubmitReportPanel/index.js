import React from 'react';
import s from './SubmitReportPanel.scss';
import uploadIcon from '../../../assets/images/upload.svg';
import downloadIcon from '../../../assets/images/download.svg';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import FileInput from 'react-file-reader-input';

import Enum from '../../../constants/enum';

import { SOCKIO_HOST } from '../../../constants';
import Socket from 'socket.io-client';

var io = Socket(SOCKIO_HOST);

class SubmitReportPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileNameAA: 'Upload File',
      fileNameMP: 'Upload File',
      fileAA: undefined,
      fileMP: undefined,
      downloadAA: false,
      downloadMP: false,
    };

    this.fileInputAA = null;
    this.fileInputMP = null;

    this.reportAAPath = 'reports/aa/' + this.props.incidentId;
    this.reportMPPath = 'reports/mp/' + this.props.incidentId;
  }

  componentWillMount() {
    this.checkExist();

    io.on('fetch', type => {
      if (Enum.socketEvents.REPORT == type) {
        this.checkExist();
        console.log(
          'SocketIo: received "report" at ' + new Date().getTime() + 'ms',
        );
      }
    });
  }

  checkExist = () => {
    fetch(
      API_HOST +
        'api/incident/report_exist?incident_id=' +
        this.props.incidentId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data =>
        this.setState({
          downloadAA: data.aa_exists,
          downloadMP: data.mp_exists,
        }),
      )
      .catch(err => console.log(err));
  };

  downloadReport = path => {
    window.location = API_HOST + path;
  };

  submitReport = () => {
    let incidentId = this.props.incidentId;

    if (this.state.fileAA) {
      let reader = new FileReader();
      reader.readAsBinaryString(this.state.fileAA);

      reader.onload = () => {
        fetch(API_HOST + 'api/incident/uploadReportAA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            incidentId: incidentId,
            fileAA: reader.result,
          }),
        })
          .then(res => res.json())
          .then(data => {
            io.emit('notify', Enum.socketEvents.REPORT);
            console.log(
              'SocketIo: emitted "report" at ' + new Date().getTime() + 'ms',
            );
            alert('File upload success!');
          })
          .catch(err => console.log(err));
      };
    }

    if (this.state.fileMP) {
      let reader2 = new FileReader();
      reader2.readAsBinaryString(this.state.fileMP);

      reader2.onload = () => {
        fetch(API_HOST + 'api/incident/uploadReportMP', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            incidentId: incidentId,
            fileMP: reader2.result,
          }),
        })
          .then(res => res.json())
          .then(data => this.setState({ dispatchedUnits: data }))
          .catch(err => console.log(err));
      };
    }

    if (!this.state.fileAA && !this.state.fileMP) {
      alert('No files to upload.');
    }
  };

  handleChangeAA = (ev, res) => {
    res = res[0];
    console.log(res);
    this.setState({ fileNameAA: res[1].name });
    this.setState({ fileAA: res[1] });
  };

  handleChangeMP = (ev, res) => {
    res = res[0];
    this.setState({ fileNameMP: res[1].name });
    this.setState({ fileMP: res[1] });
  };

  renderDownloadAA() {
    if (this.state.downloadAA) {
      return (
        <div
          className={s.upload}
          onClick={() => {
            this.downloadReport(this.reportAAPath);
          }}
        >
          <img src={downloadIcon} /> Download
        </div>
      );
    } else {
      return (
        <FileInput as="binary" id="reportAA" onChange={this.handleChangeAA}>
          <div className={s.upload}>
            <img src={uploadIcon} /> {this.state.fileNameAA}
          </div>
        </FileInput>
      );
    }
  }

  renderDownloadMP() {
    if (this.state.downloadMP) {
      return (
        <div
          className={s.upload}
          onClick={() => {
            this.downloadReport(this.reportMPPath);
          }}
        >
          <img src={downloadIcon} /> Download
        </div>
      );
    } else {
      return (
        <FileInput as="binary" id="reportMP" onChange={this.handleChangeMP}>
          <div className={s.upload}>
            <img src={uploadIcon} /> {this.state.fileNameMP}
          </div>
        </FileInput>
      );
    }
  }

  renderDownloadBtn() {
    if (!this.state.downloadAA || !this.state.downloadMP)
      return (
        <div className={s.submitBtn} onClick={this.submitReport}>
          Submit Reports
        </div>
      );
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.title}>Report Submissions</div>

        <div className={s.body}>
          <p>After Action Report</p>
          {this.renderDownloadAA()}
          <p>Manpower Report</p>
          {this.renderDownloadMP()}
        </div>

        <br />
        <div className={s.buttonPanel}>{this.renderDownloadBtn()}</div>
      </div>
    );
  }
}

export default withStyles(s)(SubmitReportPanel);
