const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_URI;
const DB = process.env.DB_NAME;
var _db;

module.exports = {
  mongoConnect: (callback) => {
    MongoClient.connect(
      URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        if (err) {
          console.log("Connection to MongoDB failed: " + err);
          return;
        }
        _db = client.db(DB);
        console.log("Connection to MongoDB successful");
        callback(err, client);
      }
    );
  },

  getDatabase: () => {
    return _db;
  },
};
