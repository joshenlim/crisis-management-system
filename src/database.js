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

  getAllStations() {
    const res = this.query('SELECT * FROM fire_station')
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getAllStations:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getStationById(id) {
    const res = this.query('SELECT * FROM fire_station WHERE id = ?', [id])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getStationCallsign:', err.sqlMessage);
        return err.code;
      });
    return res;
  }

  getStationVehicles(stationId) {
    const res = this.query('SELECT * FROM vehicle WHERE fire_station_id = ?', [stationId])
      .then(rows => rows)
      .catch(err => {
        console.error('Error from getStationVehicles:', err.sqlMessage);
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

  createIncident(body) {
    const {
      caller_name, caller_contact, op_id,
      postal_code, address, lat, lng,
      casualty_no, category, description,
    } = body;
    const res = this.query(
      `INSERT INTO incidents (
        caller_name, caller_contact,
        postal_code, address, lat, lng,
        casualty_no, category, description,
        op_create_id, op_update_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caller_name, caller_contact,
        postal_code, address, lat, lng,
        casualty_no, category, description,
        op_id, op_id,
      ],
    )
      .then(res => {
        return res.insertId
      })
      .catch(err => {
        console.error('Error from createIncident:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  createRoadIncident(incident_id, body) {
    const { vehicle_plate, vehicle_type } = body;
    const res = this.query(
      `INSERT INTO road_traffic_acc (
      incident_id, vehicle_type, vehicle_plate
    ) VALUES (?, ?, ?)`,
      [ incident_id, vehicle_type, vehicle_plate ],
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from inserting into road_traffic_acc:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  createFireIncident(incident_id, body) {
    const { fire_spread_rate } = body;
    const res = this.query(
      `INSERT INTO fire_emergency (
      incident_id, fire_spread_rate
    ) VALUES (?, ?)`,
      [ incident_id, fire_spread_rate ],
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from inserting into fire_emergency:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }

  createMedicalIncident(incident_id, body) {
    const {
      curr_condition, level_consciousness,
      committed_suicide, suicide_method, 
      suicide_equipment
    } = body;
    const res = this.query(
      `INSERT INTO med_emergency (
        incident_id, curr_condition, level_of_consc,
        if_suicide, suicidal_method, suicidal_equipment
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [ incident_id, curr_condition, level_consciousness,
        committed_suicide, suicide_method, suicide_equipment])
      .then(newMedEmergency => newMedEmergency)
      .catch(err => {
        console.error('Error from inserting into med_emergency:', err.sqlMessage);
        return res.status(409).send({ Error: err.code });
      });
    return res;
  }
}

export default MySQLDB;
