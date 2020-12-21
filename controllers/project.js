const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");

const { getDatabase } = require("../database/connection");

const { cloudLink } = require("../config/cloudinary");
const { dataUri } = require("../middleware/multer");
const projectUtil = require("./util/projectUtil");

const DB_ADMIN = process.env.ADMIN_ROLE;

exports.getProjectCheckAccessLevel = (
  projectId,
  callback,
  accessLevel = null
) => {
  if (projectId) {
    if (accessLevel === DB_ADMIN) {
      this.findProposedProject(projectId, (data) => {
        if (data) {
          callback(data);
        }
      });
      return;
    }
    this.findApprovedProject(projectId, (data) => {
      if (data) {
        callback(data);
        return;
      }
      callback(null);
    });
  }
};

exports.findApprovedProject = (projId, callback) => {
  if (projId) {
    const db = getDatabase();
    db.collection("active_projects")
      .findOne({ _id: new mongodb.ObjectID(projId) })
      .then((data) => {
        if (data) {
          callback(data);
          return;
        }
        console.log("Project does not exist");
        callback(null);
      })
      .catch((err) => {
        console.log("Approved-FindError- Error running query: " + err);
      });
  }
};

exports.findProposedProject = (projId, callback) => {
  if (projId) {
    const db = getDatabase();
    db.collection("projects")
      .findOne({ _id: new mongodb.ObjectID(projId) })
      .then((data) => {
        if (data) {
          callback(data);
          return;
        }
        console.log("Proposed Project does not exist");
        callback(null);
      })
      .catch((err) => {
        console.log("FindError- Error running query: " + err);
      });
  }
};

exports.getProject = (req, res) => {
  const proj_id = req.params.id;
  if (proj_id) {
    this.getProjectCheckAccessLevel(
      proj_id,
      (data) => {
        if (data) {
          res.json(data);
        } else {
          console.log("Cannot display project...");
          res.json({ errMessage: "Cannot display project..." });
        }
      },
      req.role
    );
  } else {
    res.json({ errMessage: "Cannot display project..." });
  }
};

exports.getAllProjects = (req, res) => {
  const db = getDatabase();
  db.collection("active_projects")
    .find()
    .toArray()
    .then((data) => {
      if (data) {
        //Check and update status columns
        projectUtil.updateProjectAssigned(db);
        projectUtil.updateProjectOpen(db);
        return data;
      }
    })
    .then((data) => {
      if (data) {
        res.json(data);
        return;
      }
      res.json({ errMessage: "Could not retrieve project data" });
      console.log("Could not retrieve project data");
    })
    .catch((err) => {
      console.log(`all projects- Error running query: ${err}`);
    });
};

exports.enlistWorker = (req, res) => {
  const userId = req.sessionId;
  const projId = req.body.projId;
  if (userId) {
    this.getProjectCheckAccessLevel(projId, (project) => {
      if (project) {
        projectUtil.checkWorklistForDuplicates(
          project._id,
          userId,
          (duplicate) => {
            if (!duplicate) {
              const worklist = {
                userId: userId,
                projectId: project._id,
                title: project.title,
                status: project.status,
                reward_points: project.reward_points,
              };
              //increment project current workers
              projectUtil.incrementCurrentWorker(project._id, (incremented) => {
                if (incremented) {
                  //insert into worklist collection
                  const db = getDatabase();
                  db.collection("worklist")
                    .insertOne(worklist)
                    .then((data) => {
                      if (data.insertedCount == 1) {
                        res.json({
                          message: "You have been enlisted successfully",
                          enlisted_project: worklist,
                        });
                      }
                    })
                    .catch((err) => {
                      console.log("enlistWorker- Error running query: " + err);
                    });
                }
              });
            } else {
              res.json({
                errMessage:
                  "You have already been listed as a worker for this project!",
              });
            }
          }
        );
      } else {
        res.json({ errMessage: "Project record not found" });
      }
    });
  } else {
    res.json({ errMessage: "you must be logged in to enlist" });
  }
};

exports.dropWorker = (req, res) => {
  const id = req.params.id;
  const userId = req.sessionId;
  let projId = "";
  if (userId) {
    projectUtil.getWorklistProjectId(id, (_id) => {
      if (_id) {
        projId = _id;
      } else {
        projId = id;
      }
      this.getProjectCheckAccessLevel(projId, (project) => {
        if (project) {
          projectUtil.decrementCurrentWorker(projId, (decremented) => {
            if (decremented) {
              //remove user from worklist collection
              const db = getDatabase();
              db.collection("worklist")
                .deleteOne({
                  projectId: projId,
                  userId: userId,
                })
                .then((data) => {
                  console.log(data.deletedCount);
                  if (data.deletedCount === 1) {
                    console.log(
                      userId + " successfully dropped from " + projId
                    );
                    res.json({
                      message:
                        "You have withdrawn from this project: " + projId,
                      withdrawn_project: project,
                    });
                  } else {
                    res.json({
                      errMessage:
                        "Sorry, you are not enlisted for this project",
                    });
                  }
                })
                .catch((err) => console.log(err));
            }
          });
        }
      });
    });
  } else {
    res.json({ errMessage: "You are not Authenticated!" });
  }
};

exports.addProject = async (req, res) => {
  if (!req.file) {
    res.json({ errMessage: "No file uploaded" });
  }
  // const file = dataUri(req).content; //<-- dataUri converts buffer to string
  const file = req.file;
  const { url } = await cloudLink(file);
  if (req.sessionId && url) {
    const projectRecord = {
      type: req.body.type,
      title: req.body.title,
      tools: req.body.tools,
      details: req.body.details,
      address: req.body.address,
      city: req.body.city,
      estimated_duration: req.body.estimated_duration,
      max_workers: parseInt(req.body.max_workers, 10),
      image: url,
      postedby: req.sessionId,
    };
    //add to database
    const db = getDatabase();
    db.collection("projects")
      .insertOne(projectRecord)
      .then((data) => {
        if (data.insertedCount == 1) {
          res.json({
            message: "Your project has been Received, Wait for approval!",
          });
        } else {
          res.json({ errMessage: "Could not add project" });
        }
      })
      .catch((err) => {
        console.log("Add Project- Error running query: " + err);
      });
  } else {
    res.redirect("/login");
  }
};

exports.loadPoints = (req, res) => {
  const db = getDatabase();
  //get all workers from assigned projects
  db.collection("worklist")
    .find({ status: "Assigned" }) //<-- should look for assigned projects that has been completed
    .toArray()
    .then((assignedProjects) => {
      if (assignedProjects.length > 0) {
        const numOfWorkers = assignedProjects.length;
        //Distribute points to associated users
        assignedProjects.forEach((project, index) => {
          const points = project.reward_points;
          const usersEarnedPoints = Math.floor(points / numOfWorkers);

          const user = project.userId;
          db.collection("profiles")
            .updateOne(
              { username: user },
              { $inc: { points: usersEarnedPoints } }
            )
            .then(({ result }) => {
              if (result.nModified > 0) {
                if (index + 1 === numOfWorkers) {
                  console.log(
                    `${usersEarnedPoints} points distributed to ${numOfWorkers} workers`
                  );
                  //Set Project status completed after reward is distributed
                  projectUtil.updateProjectComplete(
                    project.projectId,
                    (completed) => {
                      if (completed) {
                        //return updated user data
                        db.collection("profiles")
                          .findOne({ username: user })
                          .then((userData) => {
                            res.json({
                              message: "Your Reward Points have been added",
                              userData: userData,
                            });
                          })
                          .catch((err) => console.log(err));
                      } else {
                        res.json({ errMessage: "Error deleting project" });
                      }
                    }
                  );
                }
              } else {
                res.json({ errMessage: "Error distributing points" });
              }
            });
        });
      } else {
        console.log("distrubuteModel: No projects completed/assigned");
        res.json({ errMessage: "No new projects have completed/assigned." });
      }
    })
    .catch((err) => {
      console.log("Distribute points error:", err);
    });
};
