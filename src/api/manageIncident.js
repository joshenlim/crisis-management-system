import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { incid } = req.query;
  const incidents = await database
    .query('SELECT * FROM incidents WHERE incident_id = ?', [incid])
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getIncidentById:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(incidents);
});

router.get('/get_ongoing', async (req, res) => {
  const incidents = await database
    .query("SELECT * FROM incidents WHERE status = 'ongoing'")
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getAllIncident:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(incidents);
});

router.get('/get_by_status', async (req, res) => {
  const { status } = req.query;
  const incidents = await database
    .query('SELECT * FROM incidents WHERE status = ?', [status])
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getIncidentByStatus:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(incidents);
});

router.post('/create', async (req, res) => {
  const {
    postal_code,
    address,
    call_time,
    completed_at,
    casualty_no,
    category,
    description,
    op_create_id,
    op_update_id,
  } = req.headers;
  // console.log(req.headers);
  await database
    .query(
      `INSERT INTO incidents (postal_code, 
        address,
        call_time,
        completed_at,
        casualty_no,
        category,
        description,
        op_create_id,
        op_update_id)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postal_code,
        address,
        call_time,
        completed_at,
        casualty_no,
        category,
        description,
        op_create_id,
        op_update_id,
      ],
    )
    .then(rows => rows)
    .catch(err => {
      console.error('Error from createIncident:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send({
    Success: 'Incident successfully created',
  });
});

router.post('/update', async (req, res) => {
  const {
    postal_code,
    address,
    call_time,
    updated_at,
    completed_at,
    casualty_no,
    category,
    description,
    status,
    op_create_id,
    op_update_id,
    incident_id,
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
        postal_code,
        address,
        call_time,
        updated_at,
        completed_at,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
        incident_id,
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
  // res.status(200).send(incidents);
});

router.get('/get_id', async (req, res) => {
  const { emergid } = req.query;
  const incidents = await database
      .query('SELECT i.* FROM incidents i,civil_emergency e WHERE e.incident_id = ? AND i.incident_id=e.incident_id', [
      emergid,
    ])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getEmergencyIncidentById:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  return res.status(200).send(incidents);
});

router.get('/get', async (req, res) => {
  const incidents = await database
    .query("SELECT * FROM incidents WHERE status = 'resolved'")
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getArchivedIncident:', err.sqlMessage);
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

router.post('/create', async (req, res) => {
  const {
    id,
    plate_number,
  } = req.headers;

 await database
    .query('UPDATE vehicle SET on_off_call = 1 WHERE plate_number = ?', [plate_number],
      'INSERT INTO vehicle_incident (id, plate_number) VALUES (?, ?)',
      [
        id,
        plate_number,
      ],
    )
    .then(rows => rows)
    .catch(err => {
      console.error('Error from dispatchAdditionalUnit:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  
    return res.status(200).send({
    Success: 'Dispatch on additional unit successfully created',
  });
});


export default router;
