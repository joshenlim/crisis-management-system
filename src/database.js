import mysql from 'mysql';

class MySQLDB {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  connect() {
    console.log('Connecting to MYSQL Database...');
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.connect(err => {
        if (err) return reject(err);
        console.log('Connection to MySQL Database established!');
        resolve();
      });
      this.connection.on('error', err => {
        console.error('DB error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') this.connect();
        else throw err;
      });
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.end(err => {
        if (err) return reject(err);
        console.log('Connection to MySQL Database closed.');
        resolve();
      });
    });
  }

  getStaff(username) {
    const res = this.query(
      `SELECT staff.id, staff.name, s_rank, password, staff.role_id, role.name AS role FROM staff
      JOIN role ON role.id = staff.role_id
      WHERE username = ?`,
      [username],
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getStaff:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  createStaff(name, sRank, username, password, roleId) {
    const res = this.query(
      `INSERT INTO staff (name, s_rank, username, password, role_id)
                            VALUES (?, ?, ?, ?, ?)`,
      [name, sRank, username, password, roleId],
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from createStaff:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getPolicies(roleId) {
    const res = this.query(
      'SELECT policy.id, policy.name FROM role JOIN policy ON role.id = policy.role_id WHERE role.id = ?',
      roleId,
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from createStaff:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getAllStation() {
    const res = this.query('SELECT * FROM fire_station')
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getAllStation:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getStationByID(id) {
    const res = this.query('SELECT * FROM fire_station WHERE id = ?', [id])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getStationCallsign:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getIncidentByID(incid) {
    const res = this.query('SELECT * FROM incidents WHERE incident_id = ?', [
      incid,
    ])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getIncidentById:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  getOngoingIncident() {
    const res = this.query("SELECT * FROM incidents WHERE status = 'ongoing'")
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getAllIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  getIncidentByStatus(status) {
    const res = this.query('SELECT * FROM incidents WHERE status = ?', [status])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getIncidentByStatus:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  createRoadIncident(body) {
    const {
      vehicle_type,
      caller_name,
      caller_contact,
      postal_code,
      address,
      lat,
      lng,
      call_time,
      casualty_no,
      category,
      description,
      status,
      op_create_id,
      op_update_id,
    } = body;
    const res = this.query(
      `INSERT INTO incidents (
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
      ],
    )
      .then(rows => {
        const res2 = this.query(
          `INSERT INTO road_traffic_acc (
          incident_id,
          vehicle_type
        ) VALUES (?, ?)`,
          [rows.id, vehicle_type],
        )
          .then(rows1 => rows1)
          .catch(err1 => {
            console.error('Error from createIncident:', err1.sqlMessage);
            return res2.status(409).send({ Error: err1.code });
          });
      })
      .catch(err => {
        console.error('Error from createIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  }
  createFireIncident(body) {
    const {
      fire_spread_rate,
      caller_name,
      caller_contact,
      postal_code,
      address,
      lat,
      lng,
      call_time,
      casualty_no,
      category,
      description,
      status,
      op_create_id,
      op_update_id,
    } = body;
    const res = this.query(
      `INSERT INTO incidents (
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
      ],
    )
      .then(rows => {
        const res2 = this.query(
          `INSERT INTO fire_emergency (
          incident_id,
          fire_spread_rate
        ) VALUES (?, ?)`,
          [rows.id, fire_spread_rate],
        )
          .then(rows1 => rows1)
          .catch(err1 => {
            console.error('Error from createIncident:', err1.sqlMessage);
            return res2.status(409).send({ Error: err1.code });
          });
      })
      .catch(err => {
        console.error('Error from createIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  }
  createMedicalIncident(body) {
    const {
      cause_description,
      cause,
      caller_name,
      caller_contact,
      postal_code,
      address,
      lat,
      lng,
      call_time,
      casualty_no,
      category,
      description,
      status,
      op_create_id,
      op_update_id,
    } = body;
    const res = this.query(
      `INSERT INTO incidents (
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
      ],
    )
      .then(rows => {
        const res2 = this.query(
          `INSERT INTO med_emergency (
          incident_id,
          cause_description,
          cause,
        ) VALUES (?, ?, ?)`,
          [rows.id, cause_description, cause],
        )
          .then(rows1 => rows1)
          .catch(err1 => {
            console.error('Error from createIncident:', err1.sqlMessage);
            return res2.status(409).send({ Error: err1.code });
          });
      })
      .catch(err => {
        console.error('Error from createIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  }
  createGasIncident(body) {
    const {
      caller_name,
      caller_contact,
      postal_code,
      address,
      lat,
      lng,
      call_time,
      casualty_no,
      category,
      description,
      status,
      op_create_id,
      op_update_id,
    } = body;
    const res = this.query(
      `INSERT INTO incidents (
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caller_name,
        caller_contact,
        postal_code,
        address,
        lat,
        lng,
        call_time,
        casualty_no,
        category,
        description,
        status,
        op_create_id,
        op_update_id,
      ],
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from createIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
  }
}

export default MySQLDB;
