const util = require("util");
const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: process.env.DB_MAX_CONNECTION
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
