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
      `SELECT staff_id, staff.name, s_rank, password, role.role_id, role.name AS role FROM staff
      JOIN role ON role.role_id = staff.role_id
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

  addAuthority(role_id, staff_id) {
    var res;
    switch (role_id) {
      case 1:
        {
          res = this.query(
            `INSERT INTO ops_operator (staff_id)
                                VALUES (?)`,
            [staff_id],
          )
            .then(rows => rows)
            .catch(err => {
              console.error('Error from addAuthority:', err.sqlMessage);
              return err.code;
            });
        }
        break;
      case 2:
        {
          res = this.query(
            `INSERT INTO ops_manager (staff_id)
                                VALUES (?)`,
            [staff_id],
          )
            .then(rows => rows)
            .catch(err => {
              console.error('Error from addAuthority:', err.sqlMessage);
              return err.code;
            });
        }
        break;
      case 3:
        {
          //To clarify
          // res = this.query(
          //   `INSERT INTO ops_gc (staff_id)
          //                       VALUES (?)`,
          //   [staff_id],
          // )
          //   .then(rows => rows)
          //   .catch(err => {
          //     console.error('Error from addAuthority:', err.sqlMessage);
          //     return err.code;
          //   });
        }
        break;
      case 4:
        {
          res = this.query(
            `INSERT INTO specialist (staff_id)
                                VALUES (?)`,
            [staff_id],
          )
            .then(rows => rows)
            .catch(err => {
              console.error('Error from addAuthority:', err.sqlMessage);
              return err.code;
            });
        }
        break;
      case 5:
        {
          res = this.query(
            `INSERT INTO relations_officer (staff_id)
                                VALUES (?)`,
            [staff_id],
          )
            .then(rows => rows)
            .catch(err => {
              console.error('Error from addAuthority:', err.sqlMessage);
              return err.code;
            });
        }
        break;
    }
    return res;
  }

  getPolicies(roleId) {
    const res = this.query(
      'SELECT policy_id, policy.name FROM role JOIN policy ON role.role_id = policy.role_id WHERE role.role_id = ?',
      roleId,
    )
      .then(rows => rows)
      .catch(err => {
        console.error('Error from createStaff:', err.sqlMessage);
        return err.code;
      });
    return res;
  }
}

export default MySQLDB;
