const { getDatabase } = require("../persistence/connection");

const project = require("../controllers/project");
const user = require("../controllers/user");

const mongodb = require("mongodb");

exports.getUsers = (req, res) => {
  console.log("Show users");
};

exports.getAllProjects = (req, res) => {
  const db = getDatabase();
  db.collection("projects")
    .find({})
    .toArray()
    .then((data) => {
      if (data.length > 0) {
        res.json(data);
        return;
      }
      res.json({ errMessage: "Could not retrieve project data" });
    })
    .catch((err) => console.log(err));
};

exports.approveProject = (req, res) => {
  const projid = req.body.projid;
  //check if project is approved already
  project.findApprovedProject(projid, (id) => {
    if (!id) {
      project.getProposedProject(id, (project) => {
        if (project) {
          const db = getDatabase();
          db.collection("active_projects")
            .insertOne(project)
            .then((data) => {
              if (data.insertedCount == 1) {
                res.json({ message: "Project has been approved and uploaded" });
                return;
              }
              res.json({
                errMessage:
                  "Project may have already been uploaded, Check and Try again!",
              });
            })
            .catch((err) => console.log(err));
        }
      });
    }
  });
};

exports.updateProject = (req, res) => {
  const proj = {
    _id: req.body.id,
    type: req.body.type,
    title: req.body.title,
    details: req.body.details,
    status: req.body.status,
    tools: req.body.tools,
    address: req.body.address,
    city: req.body.city,
    estimated_duration: req.body.duration,
    reward_points: parseInt(req.body.point, 10),
    current_workers: parseInt(req.body.currentworkers, 10),
    max_workers: parseInt(req.body.maxworkers, 10),
  };
  const db = getDatabase();
  project.findApprovedProject(proj._id, (id) => {
    if (id) {
      db.collection("active_projects")
        .updateOne({ _id: id }, { $set: projectRecord })
        .then((data) => {
          if (data.nModified == 1) {
            res.json({ message: proj._id + " has been successfully updated" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //find project in other table
      project.findProposedProject(proj._id, (id) => {
        if (id) {
          db.collection("projects")
            .updateOne({ _id: id }, { $set: projectRecord })
            .then((data) => {
              if (data.result.ok == 1) {
                res.json({
                  message: proj._id + " has been successfully updated",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.json({ errMessage: "Could not update project" });
        }
      });
    }
  });
};

exports.archiveProject = (req, res) => {
  if (req.session.userid) {
    // admin.archiveProject(req.body.projid, (archived) => {
    //   if (archived) {
    //     res.json({ message: "Project archived" });
    //     return;
    //   }
    //   res.json({
    //     errMessage: "Project was not archived",
    //   });
    // });
  }
};

exports.getRewardsRequests = (req, res) => {
  const db = getDatabase();
  db.collection("reward_requests")
    .find({})
    .then((data) => {
      if (data) {
        res.json(data);
        return;
      }
      res.json({
        errMessage: "could not display rewards table",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteUser = (req, res) => {
  user.findUser(req.body.userid, (id) => {
    if (id) {
      const db = getDatabase();
      db.collection("profiles")
        .deleteOne({ _id: new mongodb.ObjectID(userid) })
        .then((data) => {
          if (data.result.ok === 1) {
            res.json({ message: "User Deleted" });
            return;
          }
          res.json({
            errMessage: "User was not deleted",
          });
        })
        .catch((err) => console.log(err));
    } else {
      res.json({
        errMessage: "This user does not exist",
      });
    }
  });
};

exports.deleteProject = (req, res) => {
  project.findApprovedProject(req.body.projid, (id) => {
    if (id) {
      const db = getDatabase();
      db.collection("projects")
        .deleteOne({ _id: new mongodb.ObjectID(projid) })
        .then((data) => {
          if (data.result.ok === 1) {
            res.json({ message: "Project deleted" });
            return;
          }
          res.json({
            errMessage: "Error with removing project",
          });
        })
        .catch((err) => console.log(err));
    } else {
      res.json({
        errMessage: "This project does not exist",
      });
    }
  });
};
