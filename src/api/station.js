import express from 'express';
import MySQLDB from '../database';
import config from '../config';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get_all_station', async (req, res) => {
  const stations = await database.getAllStations();
  return res.status(200).send(stations);
});

router.get('/get_station_by_id', async (req, res) => {
  const { id } = req.query;
  const station = await database.getStationById(id);
  return res.status(200).send(station);
});

router.get('/get_station_vehicles', async (req, res) => {
  const { id } = req.query;
  const vehicles = await database.getStationVehicles(id);
  return res.status(200).send(vehicles);
});

export default router;
