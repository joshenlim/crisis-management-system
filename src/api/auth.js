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
  const details = {
    id: req.session.passport.user.id,
    name: req.session.passport.user.name,
    s_rank: req.session.passport.user.s_rank,
    role_id: req.session.passport.user.role_id,
  };

  return res.status(200).send(details);
});

router.post('/register', async (req, res) => {
  // eslint-disable-next-line camelcase
  const { name, s_rank, username, password, role_id } = req.body;
  const user = await database.getStaff(username);
  if (user.length) {
    return res.status(409).send({
      Error: 'Username already exists',
    });
  }

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  await database.createStaff(name, s_rank, username, hashPassword, role_id);
  return res.status(200).send({
    Success: 'User successfully created',
  });
});

export default router;
