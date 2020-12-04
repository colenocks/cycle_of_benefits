const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");
const { getDatabase } = require("../persistence/connection");
const { cloudLink } = require("../persistence/cloudinary");
const projectUtil = require("./util/projectUtil");

const DB_ADMIN = process.env.ADMIN_USER;

const _getProjectCheckAccessLevel = (
  projectId,
  callback,
  accessLevel = null
) => {
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
          console.log("Get active_project- Error running query: " + err);
        });
    }
  }
};

exports.findApprovedProject = (projid, callback) => {
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
};

exports.findProposedProject = (projid, callback) => {
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
};

// exports.getProposedProject = (projectId, callback)=> {
//   if (projectId) {
//     const db = getDatabase();
//     db.collection("projects")
//       .findOne({ _id: new mongodb.ObjectID(projectId) })
//       .then((data) => {
//         if (data) {
//           callback(data);
//         } else {
//           callback(null);
//         }
//       })
//       .catch((err) => {
//         console.log("Get Proposed Project- Error running query: " + err);
//       });
//   }
// }

exports.getProject = (req, res) => {
  const proj_id = req.params.id;
  if (proj_id) {
    _getProjectCheckAccessLevel(
      proj_id,
      (data) => {
        if (data) {
          res.json(data);
        } else {
          console.log("Cannot display project...");
          res.json({ errMessage: "Cannot display project..." });
        }
      },
      req.session.userid
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

exports.getUserProjects = async (req, res) => {
  if (req.session.userid) {
    const db = getDatabase();
    try {
      const projects = await db
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
      if (projects) {
        res.json(projects);
      } else {
        res.json({ errMessage: "You have not enlisted for any projects" });
      }
    } catch (err) {
      console.log("getuser: ", err);
    }
  }
};

exports.enlistWorker = (req, res) => {
  if (req.session.userid) {
    const userid = req.session.userid;
    const projid = req.body.projid;
    //getProject
    _getProjectCheckAccessLevel(projid, (project) => {
      if (project) {
        projectUtil.checkWorklistForDuplicates(
          project._id,
          userid,
          (duplicate) => {
            if (!duplicate) {
              const worklist = {
                userId: userid,
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
  const projid = req.body.projid;
  const userid = req.session.userid;
  if (userid) {
    projectUtil.decrementCurrentWorker(projid, (decremented) => {
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
              res.json({
                message: "You have withdrawn from this project: " + projid,
              });
            } else {
              res.json({
                errMessage: "Sorry, you are not enlisted for this project",
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  } else {
    res.json({ errMessage: "You are not logged in" });
  }
};

exports.addProject = async (req, res) => {
  if (!req.file) {
    res.json({ errMessage: "No file uploaded" });
  }
  const { url } = await cloudLink(req.file);
  if (req.session.userid && url) {
    const projectRecord = {
      type: req.body.type,
      title: req.body.title,
      tools: req.body.tools,
      details: req.body.details,
      address: req.body.address,
      city: req.body.city,
      duration: req.body.duration,
      maxworkers: parseInt(req.body.max, 10),
      image: url,
      postedby: req.session.userid,
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

exports.viewProject = (req, res) => {
  if (req.session.userid == DB_ADMIN) {
    this.findProposedProject(req.body.id, (id) => {
      if (id) {
        res.json({
          redirect_path: `/project/${id}`,
        });
      }
    });
  } else {
    this.findApprovedProject(req.body.id, (id) => {
      if (id) {
        res.json({
          redirect_path: `/project/${id}`,
        });
      } else {
        res.json({
          errMessage: "Cannot find project",
        });
      }
    });
  }
};

exports.loadPoints = (req, res) => {
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
            projectUtil.updateProjectComplete(
              project.projectId,
              (completed) => {
                if (completed) {
                  res.json({ message: "Your Reward Points have been added" });
                }
              }
            );
          }
        });
      } else {
        console.log("distrubuteModel: No projects have been assigned");
        res.json({ errMessage: "Projects are yet to be completed" });
      }
    })
    .catch((err) => {
      console.log("Distribute points error:", err);
    });
};
