import bcrypt from 'bcrypt-nodejs';
import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router();
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/test', async (req, res) => {
  res.status(200).send({
    ping: 'pong',
  });
});

router.get('/details', async (req, res) => {
  if (req.session.passport) {
    const details = {
      id: req.session.passport.user.id,
      name: req.session.passport.user.name,
      s_rank: req.session.passport.user.s_rank,
      role_id: req.session.passport.user.role_id,
    };

    return res.status(200).send(details);
  } else
    return res.status(409).send({
      Error: 'User not logged in',
    });
});

router.get('/gc_details', async (req, res) => {
  const {id} = req.query;
  const profile = await database.getGCDetails(id);
  return res.status(200).send(profile)
});

router.get('/get_vehicleIncident', async (req, res) => {
  const { id } = req.query;
  const incidents = await database.getDispatchedVehicles(id);
  return res.status(200).send(incidents);
});

router.post('/register', async (req, res) => {
  const { name, s_rank, username, password, role_id } = req.body;
  const user = await database.getStaff(username);
  if (user.length) {
    return res.status(409).send({
      Error: 'Username already exists',
    });
  }

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  const newUserId = await database.createStaff(name, s_rank, username, hashPassword, role_id);

  if (role_id == 3) {
    const { fire_station_id, veh_plate_num } = req.body;
    await database.updateFirestationGC(newUserId, fire_station_id, veh_plate_num);
    return res.status(200).send({
      Success: 'User successfully created',
      Note: 'Updated Fire Station GC',
    });
  } else {
    return res.status(200).send({
      Success: 'User successfully created',
    });
  }
});

export default router;
