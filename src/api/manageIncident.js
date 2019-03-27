import express from 'express';
import MySQLDB from '../database';
import SocketIO from 'socket.io-client';
import Enum from '../constants/enum';
import { SOCKIO_HOST } from '../constants/index';
import config from '../config';

var io = SocketIO(SOCKIO_HOST);

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
  const incidents = await database.getOngoingIncident();
  return res.status(200).send(incidents);
});

router.get('/get_by_status', async (req, res) => {
  const { status } = req.query;
  const incidents = await database.getIncidentByStatus(status);
  return res.status(200).send(incidents);
});

router.post('/create', async (req, res) => {
  io.emit('notify', Enum.socketEvents.NEW_INCIDENT);
  // Now just make sure that you have all of the required information
  // return res.status(200).send(req.body);

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

router.post('/update_status', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.updateStatus(reqBody);
  return res.status(201).send({
    Success: 'Incident successfully updated',
  });
});

router.post('/dispatch', async (req, res) => {
  const { id, plate_number } = req.body;

  await database
    .query(
      'UPDATE vehicle SET on_off_call = 1 WHERE plate_number = ?; INSERT INTO vehicle_incident (incident_id, plate_number, veh_status) VALUES (?, ?, "ON THE WAY")',
      [plate_number, id, plate_number],
    )
    .then(rows => rows)
    .catch(err => {
      console.error('Error from dispatchAdditionalUnit:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });

  return res.status(201).send({
    Success: 'Dispatch additional units successfully',
  });
});

export default router;
