import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import LineGraph from './LineGraph';

import { API_HOST } from '../../constants';

import s from './StatisticVisualPage.scss';
import PieChart from './PieChart';

import fetch from 'node-fetch';

class StatisticVisualPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  generateReport = () => {
    fetch('/api/incident/generate_dailyreport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.Error) alert(res.Error);
        else window.location = API_HOST + 'reports/daily';
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className={s.container}>
        <div className={s.cardTop}>
          <div className={s.title}>Daily Statistics</div>
          <br />
          <div className={s.body}>
            <div className={s.leftcol}>
              <div className={s.hugenum}>4</div>&emsp;
              <div className={s.text}>
                Incidents
                <br /> Opened
              </div>
            </div>
            <div className={s.rightcol}>
              <table>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Fire Emergency</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Gas Leak</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>Medical Emergency</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Road Traffic Accident</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={s.cardTop}>
          <div className={s.title}>Emergency Incidents</div>
          <br />
          <div className={s.body}>
            <div className={s.leftcol}>
              <div className={s.hugenum}>2</div>&emsp;
              <div className={s.text}>
                Incidents
                <br /> Escalated
              </div>
            </div>
            <div className={s.rightcol} />
          </div>
        </div>
        <div className={s.cardTop}>
          <div className={s.title}>Daily Report</div>
          <div className={s.downloadBtn} onClick={this.generateReport}>
            Generate Report
          </div>
        </div>
        <div className={s.card}>
          <div className={s.title}>Weekly Statistics</div>
          <div className={s.chart}>
            <LineGraph />
          </div>
        </div>
        <div className={s.card}>
          <div className={s.title}>Case Category</div>
          <div className={s.chart}>
            <PieChart />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StatisticVisualPage);