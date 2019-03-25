import express from 'express';
import config from '../config';
import MySQLDB from '../database';
import SocketIO from 'socket.io-client';
import Enum from '../constants/enum';
import { SOCKIO_HOST } from '../constants/index';

var io = SocketIO(SOCKIO_HOST);

const router = express.Router({ mergeParams: true });

const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { incid } = req.query;
  const incidents = await database.getIncidentByID(incid);
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
    case 'road_traffic':
      console.log('Road_traffic');
      break;
    case 'medical_emergency':
      console.log('Medical_Emergency');
      break;
    case 'fire_emergency':
      console.log('fire_emergency');
      break;
    case 'gas_leak':
      console.log('Gas_Leak');
      break;
  }
  await database.createIncident(req.body);
  return res.status(200).send({
    Success: 'Incident successfully created',
  });
});

router.post('/update', async (req, res) => {
  //TODO fix api and shift query to database.js

  const {
    postalCode,
    address,
    callTime,
    updatedAt,
    completedAt,
    casualtyNo,
    category,
    description,
    status,
    opCreateId,
    opUpdateId,
    incidentId,
  } = req.headers;
  // console.log(req.headers);
  await database
    .query(
      `UPDATE incidents SET postal_code = ?, 
      address = ?, 
      call_time = ?,
      updated_at = ?,
      completed_at = ?,
      casualty_no = ?,
      category = ?,
      description = ?,
      status = ?,
      op_create_id = ?,
      op_update_id = ? WHERE incident_id = ?`,
      [
        postalCode,
        address,
        callTime,
        updatedAt,
        completedAt,
        casualtyNo,
        category,
        description,
        status,
        opCreateId,
        opUpdateId,
        incidentId,
      ],
    )
    .then(rows => rows)
    .catch(err => {
      console.error('Error from updateIncident:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
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
