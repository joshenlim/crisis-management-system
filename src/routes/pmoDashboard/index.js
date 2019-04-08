import React from 'react';
import PmoDashboard from './PmoDashboard';
import Layout from '../../components/Layout';

import { API_HOST } from '../../constants';

async function action({ fetch }) {
  const escalatedIncidents = await fetch(
    API_HOST + 'api/incident/get_escalated',
  )
    .then(res => res.json())
    .then(data => data.reverse());

  const archivedIncidents = await fetch(
    API_HOST + 'api/incident/get_escalated_archived',
  )
    .then(res => res.json())
    .then(data => data.reverse());

  return {
    title: 'Dashboard',
    chunks: ['pmoDashboard'],
    component: (
      <Layout>
        <PmoDashboard
          escalatedIncidents={escalatedIncidents}
          archivedIncidents={archivedIncidents}
        />
      </Layout>
    ),
  };
}

export default action;
