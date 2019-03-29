import React from 'react';
import fetch from 'node-fetch';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ArchivedIncidents.scss';
import IncidentCard from '../IncidentCard';
import { API_HOST } from '../../constants';


class ArchivedIncidents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incidents: []
    }
  }

  componentWillMount() {
    this.fetchArchivedIncident();
  }

  fetchArchivedIncident = () => {
    fetch(API_HOST + 'api/incident/get_archived', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => this.setState({ incidents: data.reverse() }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className={s.archivedIncidents}>
        <h1 className={s.title}>Archived Incidents</h1>
        <div className={s.incidentList}>
          {
            this.state.incidents.length > 0 && this.state.incidents.map(incident => (
              <IncidentCard incident={incident} mountModal={this.mountModal} />
            ))
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ArchivedIncidents);
