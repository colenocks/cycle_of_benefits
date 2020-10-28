const express = require("express");

const router = express.Router();

const Admin = require("../controllers/admin");
const Project = require("../controllers/project");
const User = require("../controllers/user");

const admin = new Admin();
const project = new Project();
const user = new User();

/* showAllusers */
router.get("/showusers", (req, res) => {});

/* Get all projects */
router.get("/getallprojects", (req, res) => {
  control.getAllProjects((data) => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
  });
});

/* Approve proposed project */
router.post("/approveproject", (req, res) => {
  console.log(req.body.projid);
  const projid = req.body.projid;
  control.approveProject(projid, (approved) => {
    if (approved) {
      res.json({ message: "Project has been approved and uploaded" });
      return;
    }
    res.json({
      errMessage:
        "Project may have already been uploaded, Check and Try again!",
    });
  });
});

/* updateProject */
router.put("/updateproject", (req, res) => {
  const proj = {
    id: parseInt(req.body.id, 10),
    type: req.body.type,
    title: req.body.title,
    details: req.body.details,
    tools: req.body.tools,
    address: req.body.address,
    city: req.body.city,
    duration: req.body.duration,
    point: parseInt(req.body.point, 10),
    maxworkers: parseInt(req.body.maxworkers, 10),
  };
  project.updateProject(proj, (updated) => {
    if (updated) {
      res.json({ message: proj.id + " has been successfully updated" });
      return;
    }
    res.json({ errMessage: "Could not update project" });
  });
});

/* archiveProject */
/* router.delete("/archiveproject", (req, res) => {
  if (req.session.userid) {
    control.archiveProject(req.body.projid, archived => {
      if (archived) {
        res.json({ message: "Project archived" });
        return;
      }
      res.json({
        errMessage: "Project was not archived"
      });
    });
  }
}); */

/* showAllRedeemedRewards */
router.get("/showrewards", (req, res) => {
  control.getAllRewardRequests((data) => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({
      errMessage: "could not display rewards table",
    });
  });
});

/* RemoveUser */
router.delete("/removeuser", (req, res) => {
  user.find(req.body.userid, (id) => {
    if (id) {
      control.removeUser(req.body.userid, (deleted) => {
        if (deleted) {
          res.json({ message: "User Deleted" });
          return;
        }
        res.json({
          errMessage: "User was not deleted",
        });
      });
    } else {
      res.json({
        errMessage: "This user does not exist",
      });
    }
  });
});

/* RemoveProject */
router.delete("/removeproject", (req, res) => {
  project.findProject(req.body.projid, (id) => {
    if (id) {
      control.removeProject(req.body.projid, (removed) => {
        if (removed) {
          res.json({ message: "Project removed" });
          return;
        }
        res.json({
          errMessage: "Error with removing project",
        });
      });
    } else {
      res.json({
        errMessage: "This project does not exist",
      });
    }
  });
});

module.exports = router;
