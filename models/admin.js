const dbconnect = require("../persistence/connection");

//Create a User Interface
function Control() {}

Control.prototype = {
  getAllRewardRequests: function (callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_RewardsRequest`;
    request
      .query(queryString)
      .then((data) => {
        if (data.recordset.length > 0) {
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
    let queryString = `SELECT t1.* FROM Tbl_Projects t1
    WHERE t1.projId NOT IN (SELECT t2.projId FROM
     Tbl_Projects_Approved t2)`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then((data) => {
        if (data.recordset.length > 0) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  approveProject: function (id, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects_Approved 
               WHERE projId = ${id}`;
    request
      .query(queryString)
      .then((data) => {
        if (data.rowsAffected == 1) {
          console.log("Project already added");
          callback(null);
        } else {
          //Add into table
          let innerQuery = `INSERT INTO cyobDB.dbo.Tbl_Projects_Approved
        SELECT * FROM cyobDB.dbo.Tbl_Projects
         WHERE projId = ${id}`;
          request
            .query(innerQuery)
            .then((data) => {
              if (data.rowsAffected == 1) {
                callback(true);
                return;
              }
              callback(null);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  },

  removeUser: function (userid, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    // two queries
    let queryStrings = `DELETE FROM cyobDB.dbo.Tbl_Profiles
                      WHERE userId = '${userid}';
                      
                      DELETE FROM cyobDB.dbo.Tbl_Users
                      WHERE userId = '${userid}'`;
    request
      .query(queryStrings)
      .then((data) => {
        if (data.rowsAffected > 1) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  removeProject: function (projid, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `DELETE FROM cyobDB.dbo.Tbl_Projects
                      WHERE projId = ${projid}`;
    request
      .query(queryString)
      .then((data) => {
        if (data.rowsAffected > 1) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },
};

module.exports = Control;
