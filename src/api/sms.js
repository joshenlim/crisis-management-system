import express from 'express';

const client = require('twilio')(
  'AC7f59907990b789ffa0d3012ca0deb34d',
  '0ac5e93a426a622a22c56af967fd6d70',
);

const router = express.Router();

router.post('/broadcast', (req, res) => {
  const { message } = req.body;

  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: '+19733397445',
      to: '+6596554936', //+6596554936
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
