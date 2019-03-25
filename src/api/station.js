import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get_all_station', async (req, res) => {
  const stations = await database.getAllStation();
  return res.status(200).send(stations);
});

router.get('/get_station_by_id', async (req, res) => {
  const { id } = req.query;
  const stations = await database.getStationByID(id);
  return res.status(200).send(stations);
});

export default router;
