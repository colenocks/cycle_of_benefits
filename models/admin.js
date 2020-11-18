const { getDatabase } = require("../persistence/connection");

const mongodb = require("mongodb");

//Create a User Interface
function Admin() {}

Admin.prototype = {
  getAllRewardRequests: function (callback) {
    const db = getDatabase();
    db.collection("reward_requests")
      .find({})
      .then((data) => {
        if (data) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getAllProjects: function (callback) {
    const db = getDatabase();
    db.collection("projects")
      .find({})
      .toArray()
      .then((data) => {
        if (data.length > 0) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  approveProject: function (project, callback) {
    db.collection("active_projects")
      .insertOne(project)
      .then((data) => {
        if (data.insertedCount == 1) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  removeUser: function (userid, callback) {
    const db = getDatabase();
    db.collection("profiles")
      .deleteOne({ _id: new mongodb.ObjectID(userid) })
      .then((data) => {
        if (data.result.ok === 1) {
          db.collection("users")
            .deleteOne({ _id: userid })
            .then((data) => {
              if (data.result.ok === 1) {
                callback(true);
                return;
              }
              callback(null);
            });
        }
      })
      .catch((err) => console.log(err));
  },

  removeProject: function (projid, callback) {
    const db = getDatabase();
    db.collection("projects")
      .deleteOne({ _id: new mongodb.ObjectID(projid) })
      .then((data) => {
        if (data.result.ok === 1) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },
};

module.exports = Admin;
