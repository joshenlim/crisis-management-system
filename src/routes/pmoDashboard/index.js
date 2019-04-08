import React from 'react';
import PmoDashboard from './PmoDashboard';
import Layout from '../../components/Layout';

const localAPI = 'http://localhost:3000/api';

async function action({ fetch }) {
  const escalatedIncidents = await fetch(localAPI + '/incident/get_escalated')
    .then(res => res.json())
    .then(data => data.reverse())

  return {
    title: 'Dashboard',
    chunks: ['pmoDashboard'],
    component: (
      <Layout>
        <PmoDashboard escalatedIncidents={escalatedIncidents} />
      </Layout>
    ),
  };
}

export default action;
