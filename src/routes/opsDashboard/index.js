import React from 'react';
import OpsDashboard from './OpsDashboard';
import Layout from '../../components/Layout';
import { format } from 'path';

const localAPI = 'http://localhost:3000/api';

async function action({ fetch }) {
  const fireStationList = await fetch(localAPI + '/station/get_all_station')
    .then(res => res.json())
    .then(data => data)

  for (const station of fireStationList) {
    const fetchVehicleList = await fetch(localAPI + '/station/get_station_vehicles?id=' + station.id)
      .then(res => res.json())
      .then(data => {
        station.vehicles = data;
      });
  }

  return {
    title: 'Dashboard',
    chunks: ['opsDashboard'],
    component: (
      <Layout>
        <OpsDashboard fireStationList={fireStationList} />
      </Layout>
    ),
  };
}

export default action;
