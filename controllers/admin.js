const { getDatabase } = require("../database/connection");
const { dataUri } = require("../middleware/multer");
const { uploader, cloudLink } = require("../config/cloudinary");
const {
  filterEmptyValues,
  filterUnchangedValueAndRemoveId,
  typeCastNumberValues,
} = require("../util/utility");

const projectController = require("../controllers/project");
const userController = require("../controllers/user");

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
  const projId = req.body.projId;
  //check if project is approved already
  projectController.findApprovedProject(projId, (data) => {
    if (!data) {
      projectController.findProposedProject(projId, (project) => {
        if (project) {
          const db = getDatabase();
          db.collection("active_projects")
            .insertOne(project)
            .then((data) => {
              if (data.insertedCount === 1) {
                res.json({ message: "Project has been approved" });
                return;
              }
              res.json({
                errMessage: "Something went wrong with approving project",
              });
            })
            .catch((err) => console.log(err));
        } else {
          res.json({
            errMessage: "Something Happened! Can not find project.",
          });
        }
      });
    } else {
      res.json({
        errMessage: "Project has already been uploaded",
      });
    }
  });
};

exports.updateProject = async (req, res) => {
  const updateData = req.body;
  const projId = req.params.projId;
  if (!req.file) {
    console.log("No Image File uploaded.");
  }
  const { url, error } = await cloudLink(req.file);
  if (url) updateData[req.file.fieldname] = url;

  let updatedData = filterEmptyValues(updateData);
  const db = getDatabase();
  projectController.findApprovedProject(projId, (oldProject) => {
    const { _id } = oldProject;
    if (oldProject) {
      updatedData = filterUnchangedValueAndRemoveId(oldProject, updatedData);
      if (Object.keys(updatedData).length < 1) {
        res.json({ errMessage: "No changes detected!" });
      } else {
        updatedData = typeCastNumberValues(oldProject, updatedData);

        db.collection("active_projects")
          .updateOne({ _id: _id }, { $set: updatedData })
          .then((data) => {
            if (data.result.nModified === 1) {
              //update project in other collection
              db.collection("projects")
                .updateOne({ _id: _id }, { $set: updatedData })
                .then((data) => {
                  if (data.result.nModified === 1) {
                    projectController.findApprovedProject(
                      _id,
                      (updatedProject) => {
                        res.json({
                          message: _id + " has been successfully updated",
                          updatedProject,
                        });
                      }
                    );
                  } else {
                    res.json({
                      errMessage: "Proposed: Could not update project",
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              res.json({ errMessage: "Could not update project" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
};

exports.archiveProject = (req, res) => {
  const projId = req.body.projId;
  admin.archiveProject(projId, (archived) => {
    if (archived) {
      res.json({ message: "Project archived" });
      return;
    }
    res.json({
      errMessage: "Project was not archived",
    });
  });
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
  const userId = req.body.userId;
  userController.findUser(userId, (id) => {
    if (id) {
      const db = getDatabase();
      db.collection("profiles")
        .deleteOne({ _id: new mongodb.ObjectID(userId) })
        .then((data) => {
          if (data.result.n === 1) {
            res.json({
              message: "User " + userId + " has been Deleted Sussesfully",
            });
            return;
          }
          res.json({
            errMessage: "User " + userId + " was not deleted",
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
  const projId = req.body.projId;
  projectController.findApprovedProject(projId, (data) => {
    if (data) {
      const db = getDatabase();
      db.collection("active_projects")
        .deleteOne({ _id: new mongodb.ObjectID(projId) })
        .then((data) => {
          if (data.deletedCount === 1) {
            res.json({
              message: "Project " + projId + " has been deleted successfully",
            });
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
