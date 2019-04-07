import express from 'express';
import dotenv from 'dotenv';

import twitter from 'twitter';

dotenv.config();
const router = express.Router();

var client = new twitter({
  consumer_key: process.env.TWITTER_APIKEY,
  consumer_secret: process.env.TWITTER_APIKEY_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
});

router.post('/tweet', (req, res) => {
  const { message } = req.body;

  res.header('Content-Type', 'application/json');
  client.post('statuses/update', { status: message }, function(
    error,
    tweet,
    response,
  ) {
    if (!error) {
      console.log(tweet);
      return res.status(200).send(JSON.stringify({ Success: response }));
    } else {
      return res.status(409).send(JSON.stringify({ Error: error }));
    }
  });
});

export default router;
