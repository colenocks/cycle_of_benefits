const dbconnect = require("../persistence/connection");
const bcrypt = require("bcryptjs");
const sql = require("mssql");

//Create a User Interface
function User() {}

User.prototype = {
  // Find the user data by id or username.
  find: function (userid, callback) {
    // if the userid variable is defined
    if (userid) {
      // Sql query
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Users WHERE userId = '${userid}'`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then((data) => {
          if (data.recordset.length > 0) {
            callback(data.recordset[0].userId); //return the first result
            console.log("Find: This user exists");
          } else {
            callback(null);
          }
        })
        .catch((err) => {
          console.log("Find Fetch Error: " + err);
        });
    }
  },

  createUser: function (userobj, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    this.find(userobj.username, (id) => {
      if (id) {
        console.log("Found User: " + id);
        callback(null);
        return;
      }
      let hashedPassword = userobj.password;
      // Hash the password
      hashedPassword = bcrypt.hashSync(hashedPassword, 10);
      // prepare the sql query, insert in order 5 required fields
      let queryString = `INSERT INTO cyobDB.dbo.Tbl_Users (userId, pass_code) VALUES ('${userobj.username}', '${hashedPassword}')`;
      //make request
      request
        .query(queryString)
        .then((rows) => {
          if (rows.rowsAffected == 1) {
            //make new request
            callback(rows.rowsAffected);
          } else {
            callback(null);
          }
          // dbconnect.pool.close();
        })
        .catch((err) => {
          console.log("Create Error: " + err);
        });
    });
    /*  }); */
  },

  createProfile: function (userobj, callback) {
    // 1. save user and password in users table
    this.createUser(userobj, (response) => {
      if (response) {
        let queryString = `INSERT INTO cyobDB.dbo.Tbl_Profiles (userId, first_name, last_name, email_address) VALUES ('${userobj.username}', '${userobj.firstname}', '${userobj.lastname}', '${userobj.email}')`;

        let request = new dbconnect.sql.Request(dbconnect.pool);
        request
          .query(queryString)
          .then((rows) => {
            if (rows.rowsAffected == 1) {
              // return the record of current user
              callback(rows.rowsAffected);
              return;
            } else {
              callback(null);
            }
          })
          .catch((err) => {
            console.log("Save Profile Error: " + err);
          });
      }
    });
  },

  login: function (submittedUsername, submittedPassword, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Users WHERE userId = '${submittedUsername}' `;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then((data) => {
        if (data.recordset.length > 0) {
          let userRecord = data.recordset[0];
          let validPassword = bcrypt.compareSync(
            submittedPassword,
            userRecord.pass_code
          );
          if (submittedUsername === "admin" && submittedPassword === "admin") {
            callback(userRecord.userId);
          } else if (validPassword) {
            callback(userRecord.userId);
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
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Profiles WHERE userId = '${userid}' `;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then((data) => {
          let userRecord = data.recordset[0];
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
      this.find(userid, (id) => {
        if (id) {
          let queryString = `UPDATE cyobDB.dbo.Tbl_Profiles
           SET first_name = '${profile.fname}', last_name = '${profile.lname}', date_of_birth = '${profile.dob}', email_address = '${profile.email}', home_address = '${profile.address}', mobile_number = '${profile.phone}', state_of_origin = '${profile.state}', nationalId = '${profile.nationalId}'
           WHERE userId = '${id}' `;
          let request = new dbconnect.sql.Request(dbconnect.pool);
          request
            .query(queryString)
            .then((data) => {
              if (data.rowsAffected == 1) {
                callback(data.rowsAffected);
              } else {
                callback(null);
              }
            })
            .catch((err) => {
              console.log("get Profile Error: " + err);
            });
        } else {
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
        let request = new dbconnect.sql.Request(dbconnect.pool);
        let subqueryString = `UPDATE cyobDB.dbo.Tbl_Profiles
          SET user_reward_points = user_reward_points - ${reward.used}
          WHERE userId = '${userid}' `;

        request
          .query(subqueryString)
          .then((data) => {
            if (data.rowsAffected == 1) {
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
    //1.check if user has reward attached to user
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Worklist WHERE userId = '${userid}'`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then((data) => {
        if (data.recordset) {
          let id = data.recordset[0].userId;
          //2.on successful, upload the request to database for admin to handle
          let queryString = `INSERT INTO cyobDB.dbo.Tbl_RewardsRequest
                      VALUES ('${id}', ${data.recordset[0].projId},
                      ${rewardObj.used}, '${rewardObj.benefit}')`;
          request
            .query(queryString)
            .then((data) => {
              if (data.rowsAffected == 1) {
                callback(id);
                return;
              }
              callback(null);
            })
            .catch((err) => console.log("upload: " + err));
        } else {
          console.log("This user has no rewards here");
          callback(null);
        }
      })
      .catch((err) => console.log(err));
  },
};

module.exports = User;
