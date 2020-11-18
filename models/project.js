const { getDatabase } = require("../persistence/connection");
const mongodb = require("mongodb");
const DB_ADMIN = process.env.ADMIN_USER;

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
          console.log("Approved-FindError- Error running query: " + err);
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
            if (data.nModified == 1) {
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

  getProject: function (projectId, callback, accessLevel = null) {
    if (projectId) {
      const db = getDatabase();
      if (accessLevel === DB_ADMIN) {
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
            console.log("Get project- Error running query: " + err);
          });
      } else {
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
      .toArray()
      .then((data) => {
        if (data) {
          const projectRecords = data;
          //Check and update status columns
          this.updateProjectAssigned(db);
          this.updateProjectOpen(db);
          //return all projects
          callback(projectRecords);
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log(`all projects- Error running query: ${err}`);
      });
  },

  updateProjectOpen: function (db) {
    const filter = {
      $expr: { $lt: ["$current_workers", "$max_workers"] },
    };
    const updateData = { $set: { status: "Open" } };
    db.collection("active_projects")
      .updateMany(filter, updateData)
      .then(({ result }) => {
        const { nModified } = result;
        if (nModified > 0) {
          this.updateWorklistOpen(db).then(() => {
            console.log(`Open: ${nModified} status(es) updated`);
          });
        } else {
          console.log(`Open: no status updated`);
        }
      })
      .catch((err) => {
        console.log(`Unable to update project status to Open- ${err}`);
      });
  },

  updateWorklistOpen: async function (db) {
    const filter = { $expr: { $lt: ["$current_workers", "$max_workers"] } };
    const updateData = { $set: { status: "Open" } };
    db.collection("worklist")
      .updateMany(filter, updateData)
      .then(({ result }) => {
        const { nModified } = result;
        if (nModified > 0) {
          console.log(
            nModified + " worklist document(s) updated status to Open"
          );
        } else {
          console.log("Open: no worklist statuses updated");
        }
      })
      .catch((err) => {
        console.log(`unable to update worklist status to Open: ${err}`);
      });
  },

  updateWorklistAssigned: (db) => {
    const filter = {
      status: { $ne: "Completed" },
      $expr: { $eq: ["$current_workers", "$max_workers"] },
    };
    const updateData = { $set: { status: "Assigned" } };
    db.collection("worklist")
      .updateMany(filter, updateData)
      .then(({ result }) => {
        const { nModified } = result;
        if (nModified > 0) {
          console.log(
            `${nModified} worklist document(s) updated status to Assigned`
          );
        } else {
          console.log("Open: no worklist statuses updated");
        }
      })
      .catch((err) => {
        console.log(`unable to update worklist status to Assigned: ${err}`);
      });
  },

  updateProjectAssigned: function (db) {
    const filter = {
      status: { $ne: "Completed" },
      $expr: { $eq: ["$current_workers", "$max_workers"] },
    };
    const updateData = { $set: { status: "Assigned" } };
    db.collection("active_projects")
      .updateMany(filter, updateData)
      .then(({ result }) => {
        let { nModified } = result;
        if (nModified > 0) {
          this.updateWorklistAssigned(db);
          console.log(`${nModified} document(s) updated status to Assigned`);
        } else {
          console.log("Assigned: no statuses updated");
        }
      })
      .catch((err) => {
        console.log(`unable to update project status to Assigned: ${err}`);
      });
  },

  updateProjectComplete: function (projid, callback) {
    const db = getDatabase();

    this.findApprovedProject(projid, (id) => {
      if (id) {
        const filter = { _id: id };
        const updateData = { $set: { status: "Completed", reward_points: 0 } };
        db.collection("active_projects")
          .updateOne(filter, updateData)
          .then(({ result }) => {
            const { nModified } = result;
            if (nModified > 0) {
              console.log(
                `${nModified}
                  " Project(s) have been flagged as Completed`
              );
              this.deleteWorklistProject(id, db, (deleted) => {
                if (deleted) callback(nModified);
              });
            } else {
              console.log(
                "error updating " + id + " status to completed, update manually"
              );
              callback(null);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  },

  deleteWorklistProject: function (id, db, callback) {
    db.collection("worklist")
      .deleteOne({ projectId: id })
      .then((data) => {
        if (data.result.ok == 1) {
          console.log(
            data.result.n + " project has been deleted from worklist"
          );
          callback(data.result);
          return;
        }
        callback(null);
      })
      .catch((err) => {
        console.log(`unable to delete worklist document: ${err}`);
      });
  },

  enlistWorker: function (project, userid, callback) {
    //check worklist
    this.checkWorklistForDuplicates(project._id, userid, (duplicate) => {
      // console.log("duplicate? ", duplicate);
      if (!duplicate) {
        const worklist = {
          userId: userid,
          projectId: project._id,
          title: project.title,
          status: project.status,
          reward_points: project.reward_points,
        };
        //increment project current workers
        this.incrementCurrentWorker(project._id, (incremented) => {
          if (incremented) {
            //insert into worklist collection
            const db = getDatabase();
            db.collection("worklist")
              .insertOne(worklist)
              .then((data) => {
                if (data.insertedCount == 1) {
                  callback("added");
                  return;
                } else {
                  console.log("could not insert into worklist ");
                  callback(null);
                }
              })
              .catch((err) => {
                console.log("enlistWorker- Error running query: " + err);
              });
          }
        });
        // } else {
        //   callback("complete");
      } else {
        console.log("Duplicate found");
        callback(null);
      }
    });
  },

  dropWorker: function (projid, userid, callback) {
    this.decrementCurrentWorker(projid, (decremented) => {
      if (decremented) {
        //remove from worklist collection
        const db = getDatabase();
        db.collection("worklist")
          .deleteOne({
            projectId: projid,
            userId: userid,
          })
          .then((data) => {
            if (data.deletedCount == 1) {
              console.log(userid + " successfully dropped from " + projid);
              callback(true);
              return;
            } else {
              console.log("User has already been removed from the list");
              callback(null);
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log("No worker has enlisted yet!");
        callback(null);
      }
    });
  },

  incrementCurrentWorker: function (projid, callback) {
    this.getProject(projid, (project) => {
      if (project) {
        const db = getDatabase();
        db.collection("active_projects")
          .updateOne(
            {
              _id: project._id,
              status: { $eq: "Open" },
              $expr: { $lt: ["$current_workers", "$max_workers"] },
            },
            { $inc: { current_workers: 1 } }
          )
          .then((data) => {
            if (data.result.nModified > 0) {
              callback(true);
              return;
            }
            //Project Already Assigned
            callback(null);
          })
          .catch((err) => {
            console.log("increment query error" + err);
          });
      }
    });
  },

  decrementCurrentWorker: function (projid, callback) {
    this.getProject(projid, (project) => {
      if (project) {
        const db = getDatabase();
        db.collection("active_projects")
          .updateOne(
            {
              _id: project._id,
              $and: [
                { current_workers: { $gt: 0 } },
                { status: { $ne: "Completed" } },
              ],
            },
            { $inc: { current_workers: -1 } }
          )
          .then((data) => {
            if (data.result.nModified > 0) {
              console.log("decremented");
              callback(true);
              return;
            } else {
              callback(null);
            }
          })
          .catch((err) => {
            console.log("decrement query error" + err);
          });
      }
    });
  },

  checkWorklistForDuplicates: function (projid, userid, callback) {
    this.findApprovedProject(projid, (id) => {
      if (id) {
        const db = getDatabase();
        db.collection("worklist")
          .findOne({ projectId: id, userId: userid })
          .then((data) => {
            // if duplicate is found
            if (data) {
              callback(data);
              return;
            }
            callback(null);
          })
          .catch((err) => {
            console.log("checkDuplicate- Error running query: " + err);
          });
      }
    });
  },

  distributePoints: async function (callback) {
    const db = getDatabase();
    //get all workers from assigned projects
    db.collection("worklist")
      .find({ status: "Assigned" })
      .toArray()
      .then((assignedProjects) => {
        if (assignedProjects) {
          const numOfWorkers = assignedProjects.length;
          //Distribute points to associated users
          assignedProjects.forEach((project, index) => {
            const points = project.reward_points;
            const usersEarnedPoints = Math.floor(points / numOfWorkers);

            const user = project.userId;
            db.collection("profiles").updateOne(
              { username: user },
              { $inc: { points: usersEarnedPoints } }
            );

            if (index + 1 === numOfWorkers) {
              console.log(
                `${usersEarnedPoints} points distributed to ${numOfWorkers} workers`
              );
              //Set Project status completed after reward is distributed
              this.updateProjectComplete(project.projectId, (completed) => {
                if (completed) {
                  callback(true);
                }
              });
            }
          });
        } else {
          console.log("distrubuteModel: No projects have been assigned");
          callback(null);
        }
      })
      .catch((err) => {
        console.log("Distribute points error:", err);
      });
  },

  getUserProjects: async function (userid, callback) {
    const db = getDatabase();
    try {
      const data = await db
        .collection("worklist")
        .aggregate([
          {
            $lookup: {
              from: "active_projects",
              localField: "projectId",
              foreignField: "_id",
              as: "user_projects",
            },
          },
        ])
        .toArray();
      if (data) {
        callback(data);
      } else {
        callback(null);
      }
    } catch (err) {
      console.log("getuser: ", err);
    }
  },
};

module.exports = Project;
