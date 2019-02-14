import express from 'express';

const router = express.Router();

router.get('/login', async (req, res) => {
    res.status(200).send({
        "ping": "pong"
    });
});

export default router;