import bcrypt from 'bcrypt-nodejs';
import express from 'express';
import config from '../config';
import MySQLDB from '../database';

const router = express.Router();
const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/test', async (req, res) => {
    res.status(200).send({
        "ping": "pong"
    });
});

router.post('/register', async(req, res) => {
    const { name, username, password } = req.body;
    const user = await database.getStaff(username);
    if (user.length) {
        return res.status(409).send({
            "Error": "Username already exists"
        });
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    await database.createStaff(name, username, hashPassword);
    return res.status(200).send({
        "Success": "User successfully created"
    });
})

export default router;