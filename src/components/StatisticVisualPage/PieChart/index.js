import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Chart from 'chart.js';
import moment from 'moment';

import Enum from '../../../constants/enum';

import s from './PieChart.scss';

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], options: {} };

    this.pieChart = null;
  }

  componentWillUnmount() {
    this.pieChart.destroy();
  }

  setupPie = container => {
    let data = {
      labels: [
        Enum.incidentCategory.FIRE,
        Enum.incidentCategory.GAS,
        Enum.incidentCategory.MEDICAL,
        Enum.incidentCategory.TRAFFIC,
      ],
      datasets: [
        {
          label: 'Population (millions)',
          backgroundColor: ['#4880FF', '#E04D58', '#FEC300', '#1FB7A8'],
          data: [4, 2, 3, 5],
        },
      ],
    };

    let options = {};

    if (container) {
      this.pieChart = new Chart(container.getContext('2d'), {
        type: 'pie',
        data: data,
        options: options,
      });
    }
  };

  render() {
    return (
      <div>
        <canvas ref={this.setupPie} width="400" height="250" />
      </div>
    );
  }
}

export default withStyles(s)(PieChart);
