import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpsDashboard.scss';
import Map from '../../components/Map';
import NavBar from '../../components/NavBar';

class OpsDashboard extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <NavBar />
          <Map />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(OpsDashboard);
