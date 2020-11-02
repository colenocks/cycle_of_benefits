const express = require("express");

const router = express.Router();

const Admin = require("../models/admin");
const Project = require("../models/project");
const User = require("../models/user");

const admin = new Admin();
const project = new Project();
const user = new User();

exports.showUsers = (req, res) => {
  console.log("Show users");
};

exports.getAllProjects = (req, res) => {
  admin.getAllProjects((data) => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
  });
};

exports.approveProjects = (req, res) => {
  console.log(req.body.projid);
  const projid = req.body.projid;
  admin.approveProject(projid, (approved) => {
    if (approved) {
      res.json({ message: "Project has been approved and uploaded" });
      return;
    }
    res.json({
      errMessage:
        "Project may have already been uploaded, Check and Try again!",
    });
  });
};

exports.updateProjects = (req, res) => {
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
};

exports.archiveProject = (req, res) => {
  if (req.session.userid) {
    admin.archiveProject(req.body.projid, (archived) => {
      if (archived) {
        res.json({ message: "Project archived" });
        return;
      }
      res.json({
        errMessage: "Project was not archived",
      });
    });
  }
};

exports.showRedeemedRewards = (req, res) => {
  admin.getAllRewardRequests((data) => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({
      errMessage: "could not display rewards table",
    });
  });
};

exports.removeUser = (req, res) => {
  user.find(req.body.userid, (id) => {
    if (id) {
      admin.removeUser(req.body.userid, (deleted) => {
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
};

exports.removeProject = (req, res) => {
  project.findApprovedProject(req.body.projid, (id) => {
    if (id) {
      admin.removeProject(id, (removed) => {
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
};
