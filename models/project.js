const { getDatabase } = require("../persistence/connection");
const mongodb = require("mongodb");

//Project Interface
function Project() {}

Project.prototype = {
  findApprovedProject: (projid, callback) => {
    if (projid) {
      const db = getDatabase();
      db.collection("active_projects")
        .findOne({ _id: new mongodb.ObjectID(projid) })
        .then((data) => {
          if (data) {
            callback(data._id);
            return;
          }
          console.log("Project does not exist");
          callback(null);
        })
        .catch((err) => {
          console.log("FindError- Error running query: " + err);
        });
    }
  },

  findProposedProject: (projid, callback) => {
    if (projid) {
      const db = getDatabase();
      db.collection("projects")
        .findOne({ _id: new mongodb.ObjectID(projid) })
        .then((data) => {
          if (data) {
            callback(data._id);
            return;
          }
          console.log("Proposed Project does not exist");
          callback(null);
        })
        .catch((err) => {
          console.log("FindError- Error running query: " + err);
        });
    }
  },

  addProject: function (proj, callback) {
    const projectRecord = {
      type: proj.type,
      title: proj.title,
      details: proj.details,
      image_url: proj.image,
      address: proj.address,
      city: proj.city,
      tools: proj.tools,
      max_workers: proj.maxworkers,
      estimated_duration: proj.duration,
      posted_by: proj.postedby,
    };

    const db = getDatabase();
    db.collection("projects")
      .insertOne(projectRecord)
      .then((data) => {
        if (data.insertedCount == 1) {
          callback(proj);
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log("Add Project- Error running query: " + err);
      });
  },

  updateProject: function (proj, callback) {
    const projectRecord = {
      type: proj.type,
      title: proj.title,
      details: proj.details,
      status: proj.status,
      image_url: proj.image,
      address: proj.address,
      city: proj.city,
      tools: proj.tools,
      current_workers: proj.currentworkers,
      max_workers: proj.maxworkers,
      estimated_duration: proj.duration,
      reward_points: proj.point,
    };

    this.findApprovedProject(proj._id, (id) => {
      if (id) {
        const db = getDatabase();
        db.collection("active_projects")
          .updateOne({ _id: id }, { $set: projectRecord })
          .then((data) => {
            if (data.nModified.ok == 1) {
              callback(true);
              return;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        //find project in other table
        this.findProposedProject(proj._id, (id) => {
          if (id) {
            const db = getDatabase();
            db.collection("projects")
              .updateOne({ _id: id }, { $set: projectRecord })
              .then((data) => {
                if (data.result.ok == 1) {
                  callback(true);
                  return;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            callback(null);
            return;
          }
        });
      }
    });
  },

  getProject: function (projectId, callback) {
    // console.log("getProject: " + projectId);
    if (projectId) {
      const db = getDatabase();
      db.collection("active_projects")
        .findOne({ _id: new mongodb.ObjectID(projectId) })
        .then((data) => {
          if (data) {
            callback(data);
          } else {
            callback(null);
          }
        })
        .catch((err) => {
          console.log("Get project- Error running query: " + err);
        });
    }
  },

  getProposedProject: function (projectId, callback) {
    if (projectId) {
      const db = getDatabase();
      db.collection("projects")
        .findOne({ _id: new mongodb.ObjectID(projectId) })
        .then((data) => {
          if (data) {
            callback(data);
          } else {
            callback(null);
          }
        })
        .catch((err) => {
          console.log("Get Proposed Project- Error running query: " + err);
        });
    }
  },

  allProjects: function (callback) {
    const db = getDatabase();
    db.collection("active_projects")
      .find()
      .next()
      .then((data) => {
        if (data) {
          const projectRecord = data;
          //Check and update status columns
          this.setProjectAssigned(projectRecord, (assigned) => {
            if (assigned) {
              console.log("Assigned: project status was updated");
            }
            this.setProjectOpen(projectRecord, (set) => {
              if (set) {
                console.log("Open: project status was updated");
              }
              //return all projects
              callback(projectRecord);
            });
          });
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log("all projects- Error running query:" + err);
      });
  },

  setProjectAssigned: function (project, callback) {
    const db = getDatabase();
    db.collection("active_projects")
      .updateMany(
        {
          _id: project._id,
          status: { $ne: "Completed" },
          $expr: { $eq: ["$current_workers", "$max_workers"] },
        },
        { $set: { status: "Assigned" } }
      )
      .then((data) => {
        let recordsAffected = data.result.nModified;
        if (recordsAffected > 1) {
          console.log(
            recordsAffected +
              " record(s) updated status to Assigned in active_projects"
          );
          //update worklist
          db.collection("worklist")
            .updateMany(
              {
                _id: project._id,
                status: { $ne: "Completed" },
              },
              { $set: { status: "Assigned" } }
            )
            .then((data) => {
              let recordsAffected = data.result.nModified;
              if (recordsAffected > 1) {
                console.log(
                  recordsAffected +
                    " record(s) updated status to Assigned in worklist"
                );
                callback(data);
              } else {
                console.log("Assigned: no worklist statuses updated");
                callback(null);
              }
            });
        } else {
          console.log("Assigned: no statuses updated");
          callback(null);
        }
      })
      .catch((err) => {
        console.log("unable to set  project status to Assigned: " + err);
      });
  },

  setProjectOpen: function (project, callback) {
    const db = getDatabase();
    db.collection("active_projects")
      .updateMany(
        {
          _id: project._id,
          $expr: { $lt: ["$current_workers", "$max_workers"] },
        },
        { $set: { status: "Open" } }
      )
      .then((data) => {
        if (data.result.nModified > 0) {
          console.log(data.rowsAffected + " row(s) updated status to Open");
          db.collection("worklist")
            .updateMany({ _id: project._id }, { $set: { status: "Open" } })
            .then((data) => {
              if (data.result.nModified > 0) {
                console.log(
                  data.rowsAffected + " row(s) updated status to Open"
                );
                callback(data);
              } else {
                console.log("Open: no worklist statuses updated");
                callback(null);
              }
            });
        } else {
          console.log("Open: no statuses updated");
          callback(null);
        }
      })
      .catch((err) => {
        console.log("unable to set project status to Open" + err);
      });
  },

  enlistWorker: function (project, userid, callback) {
    //check worklist
    this.checkWorklistForDuplicates(project.projId, userid, (noduplicate) => {
      if (noduplicate) {
        const db = getDatabase();
        const worklistRecord = db.collection("profiles").aggregrate({
          $lookup: {
            from: "active_projects",
            let: { user: "$userId" }, //set user variable for worklist userid field
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$user", userid] },
                      { $eq: ["$_id", project.projId] },
                    ],
                  },
                },
              },
              {
                $project: { $$user: 1, reward_points: 1, status: 1, title: 1 },
              }, //_id field is included automatically
            ],
          },
        });
        db.collection("worklist")
          .insertOne(worklistRecord)
          .then((data) => {
            if (data.result.insertedCount == 1) {
              callback(true);
              return;
            }
            console.log("could not insert into worklist");
          })
          .catch((err) => {
            console.log("enlistWorker- Error running query: " + err);
          });
      } else {
        callback(null);
      }
    });
  },

  updateCurrentWorker: function (project, callback) {
    const db = getDatabase();
    db.collection("active_projects")
      .updateOne(
        {
          _id: project._id,
          $expr: { $lt: [project.current_workers, project.max_no_workers] },
        },
        { $set: { current_workers: current_workers + 1 } }
      )
      .then((data) => {
        if (data.result.ok == 1) {
          callback(true);
          return;
        }
        //Project Already Assigned
        callback(null);
      })
      .catch((err) => {
        //query failed
        console.log("Update query error" + err);
      });
  },

  checkWorklistForDuplicates: function (projid, userid, callback) {
    this.findApprovedProject(projid, (id) => {
      if (id) {
        const db = getDatabase();
        db.collection("worklist")
          .find({ projectId: id, userId: userid })
          .then((data) => {
            // if no duplicate is found
            if (data) {
              callback(true);
              return;
            }
            callback(null);
          })
          .catch((err) => {
            console.log("checkDuplicate- Error running query: " + err);
          });
      }
    });
    /* check for duplicate user for a project in worklist table*/
  },

  distributePoints: function (callback) {
    const db = getDatabase();
    db.collection("active_projects")
      .find({ status: "Assigned" })
      .then((data) => {
        if (data) {
          console.log(data.length + " assigned project(s) found");
          let projectRecord = data;
          for (let i = 0; i < projectRecord.length; i++) {
            let id = projectRecord[i].projId;
            //1. get all users in worklist table for the completed project
            db.collection("worklist")
              .find({ projectId: id })
              .then((data) => {
                if (data) {
                  let worklistRecord = data;
                  let rewards = worklistRecord[0].reward_points;
                  let numWorkers = worklistRecord.length;
                  let userPoint = Math.floor(rewards / numWorkers);

                  let count = 0;
                  //2. Distribute reward points to associated users
                  for (let i = 0; i < numWorkers; i++) {
                    let user = worklistRecord[i].userId;
                    //set user_reward value
                    db.collection("profiles")
                      .updateOne(
                        { userId: user },
                        { $set: { points: points + userPoint } }
                      )
                      .then((data) => {
                        // worklistRecord[i].user_reward = userPoint;
                        count++;
                        if (count == numWorkers) {
                          console.log(
                            "points distributed to all " + count + " workers"
                          );
                          //3 .Set Project status as completed after reward is distributed
                          this.projectCompleted(result, (completed) => {
                            if (completed) {
                              callback(result);
                            } else {
                              console.log(
                                "There was an error with updating " +
                                  id +
                                  " status to completed, update manually"
                              );
                            }
                          });
                        }
                      });
                  }
                }
              });
          }
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //assign(update) the rewards point of each to equal shares of the total reward the project carries
    //add the reward points to each of the user's total rewards in the reward table
    //delete all record with the project id
  },

  //Sets Project as completed
  projectCompleted: function (projid, callback) {
    this.findApprovedProject(projid, (id) => {
      if (id) {
        const db = getDatabase();
        db.collection("active_projects")
          .updateOne(
            { _id: id },
            { $set: { status: "Completed", reward_points: 0 } }
          )
          .then((data) => {
            if (data.result.nModified > 0) {
              db.collection("worklist")
                .updateMany(
                  { projectId: id },
                  { $set: { status: "Completed", reward_points: 0 } }
                )
                .then((data) => {
                  if (data.result.nModified > 0) {
                    console.log(
                      projid + " Project has been flagged as Completed"
                    );
                    callback(true);
                    return;
                  }
                });
            } else {
              callback(null);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  },

  getUserProjects: function (userid, callback) {
    const db = getDatabase();
    db.collection("worklist")
      .aggregrate([
        {
          $lookup: {
            from: "active_projects",
            localField: "projectId",
            foreignField: "_id",
          },
        },
      ])
      .next()
      .then((data) => {
        if (data.recordset) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch((err) => console.log(err));
  },

  dropWorker: function (projid, userid, callback) {
    this.getProject(projid, (record) => {
      if (record) {
        const db = getDatabase();
        db.collection("worklist")
          .deleteOne(
            { projectId: record._id, userId: userid },
            {
              $gt: [record.current_workers, 0],
              $ne: [record.proj_status, "Completed"],
            }
          )
          .then((data) => {
            if (data.result.ok == 1) {
              /* Decrement current workers */
              db.collection("active_projects")
                .updateOne(
                  { _id: record._id },
                  { $set: { current_workers: current_workers - 1 } }
                )
                .then((data) => {
                  if (data.result.ok == 1) {
                    console.log(
                      userid + " successfully dropped from " + projid
                    );
                    callback(true);
                    return;
                  }
                });
            } else {
              console.log("User has already been removed from the list");
              callback(null);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  },
};

module.exports = Project;
