import React from 'react';
import GcDashboard from './GcDashboard';

const localAPI = 'http://localhost:3000/api';

async function action({ fetch }) {
  const publicHospitalList = await fetch(localAPI + '/hospitals/get_public_hospital')
    .then(res => res.json())
    .then(data => data)

  const privateHospitalList = await fetch(localAPI + '/hospitals/get_private_hospital')
    .then(res => res.json())
    .then(data => data)  

  return {
    title: 'GC Application | SGFront',
    chunks: ['gcDashboard'],
    component: (
      <GcDashboard hospitalList={publicHospitalList.concat(privateHospitalList)} />
    ),
  };
}

export default action;
