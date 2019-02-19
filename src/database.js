import mysql from 'mysql';

class MySQLDB {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  connect() {
    console.log("Connecting to MYSQL Database...");
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.connect(err => {
        if (err)
          return reject(err);
        console.log("Connection to MySQL Database established!");
        resolve();
      });
      this.connection.on('error', (err) => {
        console.error("DB error:", err)
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
          this.connect();
        else
          throw err;
      })
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      } );
    } );
  }

  close() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      this.connection.end(err => {
        if (err)
          return reject(err);
        console.log("Connection to MySQL Database closed.");
        resolve();
      } );
    } );
  }

  getStaff(username) {
    const res = this.query("SELECT * FROM users WHERE username = ?", username)
      .then(rows => rows)
      .catch(err => {
        console.error("Error from getStaff:", err.sqlMessage);
        return err.code
      });
    return res;
  }

  createStaff(name, username, password) {
    const res = this.query(`INSERT INTO users (name, username, password)
                            VALUES (?, ?, ?)`, [name, username, password])
      .then(rows => rows)
      .catch(err => {
        console.error("Error from createStaff:", err.sqlMessage);
        return err.code
      });
    return res;
  }
}

export default MySQLDB;
