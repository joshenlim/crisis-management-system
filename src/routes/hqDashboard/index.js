/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import HqDashboard from './HqDashboard';
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
    chunks: ['hqDashboard'],
    component: (
      <Layout>
        <HqDashboard
          escalatedIncidents={escalatedIncidents}
          archivedIncidents={archivedIncidents}
        />
      </Layout>
    ),
  };
}

export default action;
