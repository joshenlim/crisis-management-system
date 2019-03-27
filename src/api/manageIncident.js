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
  const incidents;
  if (emergency) {
    incidents = await database
      .query(
        'SELECT i.* FROM incidents i,civil_emergency e WHERE e.incident_id = ? AND i.incident_id=e.incident_id',
        [id],
      )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getEmergencyIncidentById:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
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
  console.log(req.body);

  io.emit('notify', Enum.socketEvents.NEW_INCIDENT);
  // Now just make sure that you have all of the required information
  // return res.status(200).send(req.body);

  switch (req.body.assistance_type) {
    case 'road_traffic': {
      await database.createRoadIncident(req);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
    }
    case 'medical_emergency': {
      await database.createMedicalIncident(req);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
    }
    case 'fire_emergency': {
      await database.createFireIncident(req);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
    }
    case 'gas_leak': {
      await database.createGasIncident(req);
      return res.status(200).send({
        Success: 'Incident successfully created',
      });
    }
  }
});

router.post('/update', async (req, res) => {
  await database.updateIncident(req);
  return res.status(200).send({
    Success: 'Incident successfully updated',
  });
});

router.get('/get_civil_id', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
    .query(
      'SELECT i.* FROM incidents i,civil_emergency e WHERE e.incident_id = ? AND i.incident_id=e.incident_id',
      [emergid],
    )
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getEmergencyIncidentById:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(incidents);
});

router.put('/put', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
    .query('UPDATE incidents SET status = resolved WHERE incident_id = ?', [
      emergid,
    ])
    .then(rows => rows)
    .catch(err => {
      console.error('Error from putResolvedIncident:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(201).send(incidents);
});

// router.post('/create', async (req, res) => {
//   const { id, plate_number } = req.headers;

//   await database
//     .query(
//       'UPDATE vehicle SET on_off_call = 1 WHERE plate_number = ?',
//       [plate_number],
//       'INSERT INTO vehicle_incident (id, plate_number) VALUES (?, ?)',
//       [id, plate_number],
//     )
//     .then(rows => rows)
//     .catch(err => {
//       console.error('Error from dispatchAdditionalUnit:', err.sqlMessage);
//       return res.status(409).send({ Error: err.code });
//     });

//   return res.status(200).send({
//     Success: 'Dispatch on additional unit successfully created',
//   });
// });

export default router;
