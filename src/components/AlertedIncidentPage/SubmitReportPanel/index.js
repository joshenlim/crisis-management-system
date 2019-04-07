import React from 'react';
import s from './SubmitReportPanel.scss';
import uploadIcon from '../../../assets/images/upload.svg';

import fetch from 'node-fetch';
import { API_HOST } from '../../../constants';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class SubmitReportPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.title}>Report Submissions</div>

        <div className={s.body}>
          <p>After Action Report</p>
          <div className={s.upload}>
            <img src={uploadIcon} /> Upload File
          </div>

          <p>Manpower Report</p>
          <div className={s.upload}>
            <img src={uploadIcon} /> Upload File
          </div>
        </div>

        <br />
        <div className={s.buttonPanel}>
          <div className={s.submitBtn} onClick={this.submitReport}>
            Submit Reports
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SubmitReportPanel);
