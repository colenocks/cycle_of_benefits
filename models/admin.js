const { getDatabase } = require("../persistence/connection");
const db = getDatabase();

const mongodb = require("mongodb");
const ObjectID = new mongodb.ObjectID();

//Create a User Interface
function Admin() {}

Admin.prototype = {
  getAllRewardRequests: function (callback) {
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
    db.collection("projects")
      .aggregrate([
        { $unionWith: { coll: "active_projects" } },
        { $group: { _id: "$_id" } },
      ])
      .then((data) => {
        if (data) {
          console.log(data);
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  approveProject: function (id, callback) {
    db.collection("active_projects")
      .findOne({ _id: ObjectID(id) })
      .then((data) => {
        if (data) {
          console.log("This project has already been approved");
          callback(null);
          return;
        }
        db.collection("projects")
          .findOne({ _id: ObjectID(id) })
          .then((data) => {
            if (data) {
              db.collection("active_projects")
                .insertOne(data)
                .then((data) => {
                  if (data.insertedCount == 1) {
                    callback(data);
                    return;
                  }
                  callback(null);
                });
            }
          });
      })
      .catch((err) => console.log(err));
  },

  removeUser: function (userid, callback) {
    db.collection("profiles")
      .deleteOne({ _id: ObjectID(userid) })
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
    db.collection("projects")
      .deleteOne({ _id: ObjectID(projid) })
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
