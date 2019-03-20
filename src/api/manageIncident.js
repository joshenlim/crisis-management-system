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

// router.post('/update', async (req, res) => res.status(200).send(incidents));
router.get('/get_all_station', async (req, res) => {
  const stations = await database
    .query('SELECT * FROM fire_station')
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getAllStation:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(stations);
});

router.post('/create', async (req, res) => {
  const {
    postal_code,
    address,
    created_at,
    updated_at,
    completed_at,
    addi_desc,
    casualty_no,
    category,
    description,
    status,
    create_op_id,
    update_op_id,
  } = req.headers;
  console.log(req.headers);
  await database
    .query(
      `INSERT INTO incidents (postal_code, 
      address, 
      created_at,
      updated_at,
      completed_at,
      addi_desc,
      casualty_no,
      category,
      description,
      status,
      op_create_id,
      op_update_id)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postal_code,
        address,
        created_at,
        updated_at,
        completed_at,
        addi_desc,
        casualty_no,
        category,
        description,
        status,
        create_op_id,
        update_op_id,
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

export default router;
