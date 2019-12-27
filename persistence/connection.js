const util = require("util");
const sql = require("mssql");

const dbConfig = {
  server: "cyobdbinstance.c4hjqdm5joot.eu-west-1.rds.amazonaws.com",
  database: "cyobDB",
  user: "cyobmaster",
  password: "cyob1234",
  connectionLimit: 10
};

//connect to database
let pool = new sql.ConnectionPool(dbConfig);
pool
  .connect()
  .then(connection => {
    console.log("Connected to MSSQL Database!");
    return connection;
  })
  .catch(err => {
    console.log("Could not connect to database: " + err);
  });

pool.query = util.promisify(pool.query);

module.exports = { pool, sql };
