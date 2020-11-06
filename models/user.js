const dotenv = require("dotenv");
const { getDatabase } = require("../persistence/connection");
const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

dotenv.config();

//Create a User Interface
function User() {}

User.prototype = {
  findUserId: function (userid, callback) {
    if (userid) {
      console.log("userid: " + userid);
      const db = getDatabase();
      db.collection("users")
        .findOne({ _id: userid })
        .then((document) => {
          if (document) {
            callback(document._id);
            console.log("*findUserId*: user found");
          } else {
            callback(null);
          }
        })
        .catch((err) => {
          console.log("findUserId Error: " + err);
        });
    }
  },

  createUser: function (userobj, callback) {
    this.findUserId(userobj.username, (_id) => {
      if (_id) {
        console.log("Found User: " + _id);
        callback(null);
        return;
      }

      const hashedPassword = bcrypt.hashSync(userobj.password, 10);
      const newUser = { username: userobj.username, password: hashedPassword };
      const db = getDatabase();
      db.collection("users")
        .insertOne(newUser)
        .then((data) => {
          if (data.insertedCount == 1) {
            //created user profile
            this.createProfile(userobj, (done) => {
              if (done) {
                callback(true);
                return;
              } else {
                console.log("User Profile was not created: " + err);
              }
            });
          }
          callback(null);
        })
        .catch((err) => {
          console.log("Create Error: " + err);
        });
    });
  },

  createProfile: function (userobj, callback) {
    const newUserProfile = {
      username: userobj.username,
      firstname: userobj.firstname,
      lastname: userobj.lastname,
      email: userobj.email,
    };
    const db = getDatabase();
    db.collection("profiles")
      .insertOne(newUserProfile)
      .then((data) => {
        if (data.insertedCount == 1) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => {
        console.log("Save Profile Error: " + err);
      });
  },

  login: function (username, password, callback) {
    const db = getDatabase();
    db.collection("users")
      .findOne({ username })
      .then((userRecord) => {
        if (userRecord) {
          let validPassword = bcrypt.compareSync(password, userRecord.password);
          if (
            (username === admin_username && password === admin_password) ||
            validPassword
          ) {
            callback(userRecord.username);
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log("Login Error: " + err);
      });
  },

  getProfile: function (userid, callback) {
    if (userid) {
      const db = getDatabase();
      db.collection("profiles")
        .find({ _id: userid })
        .then((userRecord) => {
          if (userRecord) {
            callback(userRecord);
          } else {
            callback(null);
          }
        })
        .catch((err) => {
          console.log("get Profile Error: " + err);
        });
    } else {
      console.log("getProfile: Userid is null");
      callback(null);
    }
  },

  updateProfile: function (userid, profile, callback) {
    if (userid) {
      this.findUserId(userid, (id) => {
        if (id) {
          const userProfile = {
            firstname: profile.fname,
            lastname: profile.lname,
            dob: profile.dob,
            email: profile.email,
            home_address: profile.address,
            phone: profile.phone,
            state: profile.state,
            nationalId: profile.nationalId,
          };
          const db = getDatabase();
          db.collection("profiles")
            .updateOne({ userId: id }, { $set: userProfile })
            .then((data) => {
              if (data) {
                callback(true);
                return;
              }
              callback(null);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("get Profile Error: " + err);
          callback(null);
        }
      });
    } else {
      console.log("updateProfile: Userid is null");
      callback(null);
    }
  },

  useReward: function (userid, reward, callback) {
    this.uploadRequest(userid, reward, (id) => {
      if (id) {
        //Update/Use points
        const db = getDatabase();
        db.collection("profiles")
          .updateOne(
            { userId: userid },
            { $set: { points: points - reward.used } }
          )
          .then((data) => {
            if (data) {
              callback(true);
              return;
            }
          })
          .catch((err) => {
            "Reward User error: ", err;
          });
      } else {
        callback(null);
      }
    });
  },

  uploadRequest: function (userid, rewardObj, callback) {
    //check if user has reward attached to user
    const db = getDatabase();
    db.collection("worklists")
      .find({ userId: userid })
      .then((data) => {
        if (data) {
          const id = data.userId;
          const requestedReward = {
            userId: id,
            projId: data.projId,
            used_points: rewardObj.used,
            reward: rewardObj.benefit,
          };
          db.collection("reward_requests")
            .insertOne(requestedReward)
            .then((data) => {
              if (data) {
                callback(id);
                return;
              }
              callback(null);
            })
            .catch((err) => console.log("upload: " + err));
        } else {
          callback(null);
        }
      })
      .catch((err) => console.log(err));
  },
};

module.exports = User;
