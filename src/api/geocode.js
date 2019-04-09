import express from 'express';
import config from '../config';
import NodeGeocoder from 'node-geocoder';

const router = express.Router({ mergeParams: true });
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: config.googleMaps.apiKey,
};
const geocoder = NodeGeocoder(options);

router.get('/address', async (req, res) => {
  const address = req.query.q;
  geocoder.geocode(address, function(err, data) {
    return res.status(200).send({
      address: data[0].formattedAddress,
      lat: data[0].latitude,
      lng: data[0].longitude,
    });
  });
});

export default router;
