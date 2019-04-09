import express from 'express';
import nodemailer from 'nodemailer';
import config from '../config';
import MySQLDB from '../database';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const database = new MySQLDB(config.mysql_config);
database.connect();

router.post('/send', (req, res) => {
  const { title, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: 'SGFront',
    to:
      'tkw1812@gmail.com, setsuna.zheng@gmail.com, joshenlimek@gmail.com, ilovesoshi99@gmail.com, muhammad.salleh.b.md.t@gmail.com, junkcontainer123@gmail.com, ngjingrui1@gmail.com, dudesuxz123@gmail.com, chuanbin@hotmail.com',
    subject: title,
    text: message,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.send(JSON.stringify({ success: false }));
    } else {
      res.send(JSON.stringify({ success: true }));
      console.log('Email sent: ' + info.response);
    }
  });
});

router.post('/log', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.logEmail(reqBody);
  return res.status(201).send({
    Success: 'Email successfully logged',
  });
});

export default router;
