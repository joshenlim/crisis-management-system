import express from 'express';
import MySQLDB from '../database';
import config from '../config';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get_all_hospital', async (req, res) => {
  const hospitals = await database.getAllHospitals();
  return res.status(200).send(hospitals);
});

router.get('/get_hospital_id', async (req, res) => {
  const { id } = req.query;
  const privateHospital = await database.getAllHospitalsById(id);
  return res.status(200).send(privateHospital);
});

router.get('/get_public_hospital', async (req, res) => {
  const publicHospital = await database.getPublicHospitals();
  return res.status(200).send(publicHospital);
});

router.get('/get_private_hospital', async (req, res) => {
  const privateHospital = await database.getPrivateHospitals();
  return res.status(200).send(privateHospital);
});

export default router;
