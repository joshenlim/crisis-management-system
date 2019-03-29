import express from 'express';
import MySQLDB from '../database';
import config from '../config';

const router = express.Router({ mergeParams: true });

const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { id, emergency } = req.query;
  var incidents;
  if (emergency) {
    incidents = await database.getEmergencyIncidentByID(id);
  } else {
    incidents = await database.getIncidentByID(id);
  }
  return res.status(200).send(incidents);
});

router.get('/get_ongoing', async (req, res) => {
  const incidents = await database.getOngoingIncidents()
  return res.status(200).send(incidents);
});

router.get('/get_archived', async (req, res) => {
  const incidents = await database.getArchivedIncidents();
  return res.status(200).send(incidents);
});

router.get('/get_by_status', async (req, res) => {
  const { status } = req.query;
  const incidents = await database.getIncidentByStatus(status);
  return res.status(200).send(incidents);
});

router.post('/create', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  const newIncidentId = await database.createIncident(reqBody);

  switch (req.body.category) {
    case 'road_traffic': {
      await database.createRoadIncident(newIncidentId, reqBody);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
      break;
    }
    case 'medical_emergency': {
      await database.createMedicalIncident(newIncidentId, reqBody);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
      break;
    }
    case 'fire_emergency': {
      await database.createFireIncident(newIncidentId, reqBody);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
      break;
    }
    case 'gas_leak': {
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
      break;
    }
  }
});

router.post('/update', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.updateIncident(reqBody);
  return res.status(200).send({
    Success: 'Incident successfully updated',
  });
});

router.get('/get_id', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
      .query('SELECT incidents.* FROM incidents JOIN civil_emergency ON incidents.id = civil_emergency.incident_id WHERE civil_emergency.incident_id = ?', [
      emergid]
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getEmergencyIncidentById:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  return res.status(200).send(incidents);
});

router.post('/update_resolved', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
      .query('UPDATE incidents SET status = "RESOLVED" WHERE id = ?', [emergid])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from updateIncidentToResolved:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  return res.status(201).send({
    Success: 'Incident successfully updated'
  });
});

router.post('/dispatch', async (req, res) => {
  const { incident_id, plate_number } = req.headers;
  await database.dispatchToIncident(incident_id, plate_number);
  return res.status(200).send({
    Success: 'Incident successfully updated'
  });
});

// **when update to close, automatically call the generate report api
router.post('/update_closed', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
      .query('UPDATE incidents, civil_emergency SET incidents.status = "CLOSED" WHERE incidents.id = civil_emergency.incident_id AND civil_emergency.incident_id = ?', [emergid])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from updateIncidentToClosed:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  return res.status(200).send({
    Success: 'Incident successfully updated'
  });
});

export default router;
