const dotenv = require("dotenv");
dotenv.config();
const { cloudLink } = require("../persistence/cloudinary");

const Project = require("../models/project");
const Admin = require("../models/admin");
const project = new Project();
const admin = new Admin();

const DB_ADMIN = process.env.ADMIN_USER;

exports.getProject = (req, res) => {
  const proj_id = req.params.id;
  if (proj_id) {
    project.getProject(
      proj_id,
      (data) => {
        if (data) {
          res.render("viewproject", {
            id: data._id ? data._id : "",
            type: data.type ? data.type : "other",
            title: data.title ? data.title : "",
            details: data.details ? data.details : "",
            address: data.address ? data.address : "",
            city: data.city ? data.city : "",
            status: data.status ? data.status : "",
            worth: data.reward_points ? data.reward_points : 0,
            tools: data.tools ? data.tools : "",
            current: data.current_workers ? data.current_workers : 0,
            maxworkers: data.max_workers ? data.max_workers : 1,
            postedby: data.posted_by ? data.posted_by : "",
            duration: data.estimated_duration
              ? data.estimated_duration
              : "unknown",
            image: data.image_url ? data.image_url : "",
          });
        } else {
          console.log("Cannot display project...");
          res.redirect("/projects");
        }
      },
      req.session.userid
    );
  } else {
    res.redirect("/projects");
  }
};

exports.getAllProjects = (req, res) => {
  project.allProjects((data) => {
    if (data) {
      res.json(data);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
    console.log("Could not retrieve project data");
  });
};

exports.getUserProjects = (req, res) => {
  if (req.session.userid) {
    project.getUserProjects(req.session.userid, (data) => {
      if (data) {
        res.json(data);
      } else {
        res.json({ errMessage: "You have not enlisted for any projects" });
      }
    });
  }
};

exports.enlistWorker = (req, res) => {
  if (req.session.userid) {
    const proj = {
      userid: req.session.userid,
      projid: req.body.projid,
    };
    //getProject
    project.getProject(proj.projid, (projrecord) => {
      if (projrecord) {
        project.enlistWorker(projrecord, proj.userid, (result) => {
          if (result) {
            if (result == "complete") {
              res.json({
                errMessage: "This project has already been completed!",
              });
            } else if (result == "added") {
              res.json({ message: "You have been enlisted successfully" });
            }
          } else {
            res.json({
              errMessage:
                "You have already been listed as a worker for this project!",
            });
          }
        });
      } else {
        res.json({ errMessage: "Project record not found" });
      }
    });
  } else {
    res.json({ errMessage: "you must be logged in to enlist" });
  }
};

exports.dropWorker = (req, res) => {
  if (req.session.userid) {
    project.dropWorker(req.body.projid, req.session.userid, (response) => {
      if (response) {
        res.json({
          message: "You have withdrawn from this project: " + req.body.projid,
        });
      } else {
        res.json({
          errMessage: "Sorry, you are not enlisted for this project",
        });
      }
    });
  } else {
    res.json({ errMessage: "you are not logged in" });
  }
};

exports.addProject = async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return;
  }

  const { url } = await cloudLink(req.file);
  console.log("clouinary url: ", url);
  if (req.session.userid && url) {
    let proj = {
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
    project.addProject(proj, (projectdata) => {
      if (projectdata) {
        res.json({
          message: "Your project has been Received, Wait for approval!",
        });
      } else {
        res.json({ errMessage: "Could not add project" });
      }
    });
  } else {
    res.redirect("/login");
  }
};

exports.viewProject = (req, res) => {
  if (req.session.userid == DB_ADMIN) {
    project.findProposedProject(req.body.id, (id) => {
      if (id) {
        res.json({
          redirect_path: `/project/${id}`,
        });
      }
    });
  } else {
    project.findApprovedProject(req.body.id, (id) => {
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
  project.distributePoints((response) => {
    if (response) {
      res.json({ message: "Your Reward Points have been added" });
      return;
    }
    res.json({ errMessage: "Projects are yet to be completed" });
  });
};
