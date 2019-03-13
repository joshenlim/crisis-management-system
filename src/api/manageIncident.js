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

router.post('/update', async (req, res) => res.status(200).send(incidents));

router.post('/create', async (req, res) => {
  const {
    postal_code,
    address,
    createdat,
    updatedat,
    completedat,
    addidesc,
    casualtyno,
    category,
    description,
    status,
    createopid,
    updateopid,
  } = req.headers;
  console.log(req.headers);
  await database.createIncident(
    postal_code,
    address,
    createdat,
    updatedat,
    completedat,
    addidesc,
    casualtyno,
    category,
    description,
    status,
    createopid,
    updateopid,
  );
  return res.status(200).send({
    Success: 'Incident successfully created',
  });
});

export default router;
