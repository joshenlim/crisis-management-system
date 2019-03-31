import React from 'react';
import OpsDashboard from './OpsDashboard';
import Layout from '../../components/Layout';

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

  const ongoingIncidents = await fetch(localAPI + '/incident/get_ongoing')
    .then(res => res.json())
    .then(data => data.reverse())

  const publicHospitalList = await fetch(localAPI + '/hospitals/get_public_hospital')
    .then(res => res.json())
    .then(data => data)

  const privateHospitalList = await fetch(localAPI + '/hospitals/get_private_hospital')
    .then(res => res.json())
    .then(data => data)  

  return {
    title: 'Dashboard',
    chunks: ['opsDashboard'],
    component: (
      <Layout>
        <OpsDashboard fireStationList={fireStationList} ongoingIncidents={ongoingIncidents} 
        publicHospitalList={publicHospitalList} privateHospitalList={privateHospitalList} />
      </Layout>
    ),
  };
}

export default action;
