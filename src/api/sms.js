import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const router = express.Router();

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
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

export default router;
