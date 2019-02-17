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

//   async deactivateJob(jobId) {
//     const res = await this.query("UPDATE audit SET active = false WHERE job_id = ?", jobId)
//       .then(rows => {
//         return rows;
//       })
//     return res;
//   }

//   async retrieveAllArticlesTags() {
//     const res = await this.query(`SELECT tag, count(*) as tagCount FROM articles \
//                                   GROUP BY tag`)
//       .then(rows => rows);
//     return res;
//   }

  

//   async retrieveGenImagesByJobId(jobId) {
//     const res = await this.query(`SELECT generated_visual.id, generated_visual.approved,\
//                                   generated_visual.tracer_id,\
//                                   output_key, output_bucket, template_name, job_name FROM audit\
//                                   INNER JOIN generated_visual ON generated_visual.tracer_id = audit.tracer_id\
//                                   WHERE job_id = ?`, jobId)
//       .then(rows => {
//         return rows;
//       })
//       .catch(err => {
//         console.error("Error from retrieveGenImagesByJobId:", err.sqlMessage, " for audit table");
//         return err.code;
//       })
//     return res;
//   }

//   async retrieveJobsByUserIdAndClientId(userId, clientId) {
//     const batches = await this.query(`SELECT a.job_id, a.job_name, a.job_type, a.client_id, a.created_at, a.user_id, a.active, b.name\
//                                       FROM ( SELECT job_id, ANY_VALUE(job_name) as job_name,\
//                                       ANY_VALUE(job_type) as job_type,\
//                                       ANY_VALUE(active) as active,\
//                                       ANY_VALUE(client_id) as client_id,\
//                                       MIN(created_at) as created_at,\
//                                       ANY_VALUE(user_id) as user_id FROM audit GROUP BY job_id )\
//                                       AS a JOIN ( SELECT id, name FROM users) AS b ON\
//                                       a.user_id = b.id\
//                                       WHERE a.user_id = ? AND a.client_id = ? AND a.job_type = 'FB_PRODUCT_FEED'\
//                                       ORDER BY a.created_at DESC`, [userId, clientId])
//       .then(rows => {
//         return rows;
//       })
//       .catch(err => {
//         console.error("Error from retrieveJobsByUserId:", err.sqlMessage, " for audit table");
//         return err.code;
//       })
//     return batches;
//   }

}

// module.exports = MySQLDB
export default MySQLDB;
