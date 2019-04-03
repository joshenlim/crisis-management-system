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

router.get('/get_station_vehicles_details', async (req, res) => {
  const { id } = req.query;
  const stationVehiclesDetails = await database.getStationVehiclesDetails(id);
  return res.status(200).send(stationVehiclesDetails);
});

router.get('/get_station_details_from_incident', async (req, res) => {
  const { id } = req.query;
  const station = await database.getFireStationDetailsByIncidentID(id);
  return res.status(200).send(station);
});

router.get('/get_dispatched_vehicles', async (req, res) => {
  const { incident_id } = req.query;
  const vehicles = await database.getDispatchedVehicles(incident_id);
  return res.status(200).send(vehicles);
});

export default router;
