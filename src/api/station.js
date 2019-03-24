import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router({ mergeParams: true });
const database = new MySQLDB(config.mysql_config);
database.connect();

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

router.get('/get_station_by_id', async (req, res) => {
  const { id } = req.query;
  const stations = await database
    .query('SELECT * FROM fire_station WHERE id = ?', [id])
    .then(rows => rows)
    .catch(err => {
      console.error('Error from getStationCallsign:', err.sqlMessage);
      return res.status(409).send({ Error: err.code });
    });
  return res.status(200).send(stations);
});

export default router;
