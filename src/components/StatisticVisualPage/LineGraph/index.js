import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Chart from 'chart.js';
import moment from 'moment';

import s from './LineGraph.scss';

class LineGraph extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], options: {} };

    //this.lineGraphRef = null;
    this.lineGraph = null;
  }

  componentWillUnmount() {
    this.lineGraph.destroy();
  }

  setupLine = container => {
    //this.lineGraphRef = container;

    let data = {
      labels: [],
      datasets: [
        {
          data: [4, 1, 2, 0, 1, 0, 3],
          label: 'Incidents',
          borderColor: '#F78B3C',
          fill: true,
          backgroundColor: '#FCC6A5',
        },
      ],
    };

    for (let i = 7; i >= 1; i--) {
      let date = moment().subtract(i, 'days');
      data.labels.push(date.format('Do MMM'));
    }

    let options = {
      yaxis: {
        tickDecimals: 0,
      },
      legend: {
        display: false,
      },
    };

    if (container) {
      this.lineGraph = new Chart(container.getContext('2d'), {
        type: 'line',
        data: data,
        options: options,
      });
    }
  };

  render() {
    return (
      <div className={s.container}>
        <canvas ref={this.setupLine} width="400" height="250" />
      </div>
    );
  }
}

export default withStyles(s)(LineGraph);
