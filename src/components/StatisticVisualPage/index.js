import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import LineGraph from './LineGraph';

import s from './StatisticVisualPage.scss';
import PieChart from './PieChart';

class StatisticVisualPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className={s.container}>
          <div className={s.card}>
            <div className={s.title}>Weekly Statistics</div>
            <LineGraph />
          </div>
          <div className={s.card}>
            <div className={s.title}>Case Category</div>
            <PieChart />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StatisticVisualPage);
