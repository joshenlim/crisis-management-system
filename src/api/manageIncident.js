import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { incid } = req.query;
  const incidents = await database
    .query('SELECT * FROM incidents WHERE id = ?', [incid])
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getIncidentById:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(incidents);
});

router.get('/get_ongoing', async (req, res) => {
  const incidents = await database
    .query("SELECT * FROM incidents WHERE NOT status = 'RESOLVED' OR status = 'CLOSED'")
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
    updated_at,
    completed_at,
    casualty_no,
    category,
    description,
    status,
    op_create_id,
    op_update_id,
    incident_id,
    if_escalate_hq,
  } = req.headers;
  // console.log(req.headers);
  await database
    .query(
      `UPDATE incidents SET postal_code = ?, 
      address = ?, 
      updated_at = ?,
      completed_at = ?,
      casualty_no = ?,
      category = ?,
      description = ?,
      status = ?,
      op_create_id = ?,
      op_update_id = ? 
      if_escalate_hq = ? WHERE incident_id = ?`,
      [
        postal_code,
        address,
        updated_at,
        completed_at,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
        if_escalate_hq,
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
      .query('SELECT incidents.* FROM incidents JOIN civil_emergency ON incidents.id = civil_emergency.incident_id WHERE civil_emergency.incident_id = ?', [
      emergid]
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getEmergencyIncidentById:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  return res.status(201).send(incidents);
});

router.get('/get_by_archived', async (req, res) => {
  const incidents = await database
    .query("SELECT * FROM incidents WHERE status = 'CLOSED'")
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getArchivedIncident:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(201).send(incidents);
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
  const {
    id,
    plate_number,
  } = req.headers;

 await database
    .query('UPDATE vehicle SET on_off_call = 1 WHERE plate_number = ?; INSERT INTO vehicle_incident (incident_id, plate_number, veh_status) VALUES (?, ?, "ON THE WAY")',
      [
        plate_number,
        id,
        plate_number,
      ],
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
  return res.status(201).send({
    Success: 'Incident successfully updated'
  });
});


export default router;
