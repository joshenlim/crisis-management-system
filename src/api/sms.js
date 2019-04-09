import express from 'express';
import MySQLDB from '../database';
import config from '../config';
import dotenv from 'dotenv';

dotenv.config();

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const router = express.Router();
const database = new MySQLDB(config.mysql_config);
database.connect();

router.post('/broadcast', (req, res) => {
  const { message } = req.body;

  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.PHONE_NUMBER, //+6596554936
      body: message,
    })
    .then(() => {
      console.log('SMS broadcasted!');
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

router.post('/log', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.logSMS(reqBody);
  return res.status(201).send({
    Success: 'SMS successfully logged',
  });
});

export default router;
