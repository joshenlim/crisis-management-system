import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { incid } = req.query;
  const incidents = await database.getIncidentById(incid);
  return res.status(200).send(incidents);
});

router.get('/get_ongoing', async (req, res) => {
  const incidents = await database.getAllIncident();
  return res.status(200).send(incidents);
});

// router.get('/update', async (req, res) => {
//   const incidents = await database.getAllIncident();
//   return res.status(200).send(incidents);
// });

router.post('/create', async (req, res) => {
  const {
    incidentId,
    postalCode,
    address,
    createdAt,
    updatedAt,
    completedAt,
    addiDesc,
    casualtyNo,
    category,
    description,
    status,
    opCreateId,
    opUpdateId,
  } = req.headers;
  await database.createIncident(
    incidentId,
    postalCode,
    address,
    createdAt,
    updatedAt,
    completedAt,
    addiDesc,
    casualtyNo,
    category,
    description,
    status,
    opCreateId,
    opUpdateId,
  );
  return res.status(200).send({
    Success: 'Incident successfully created',
  });
});

export default router;
