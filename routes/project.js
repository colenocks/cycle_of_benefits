const express = require("express");
const router = express.Router();

const { upload, cloudLink } = require("../persistence/cloudinary");

const Project = require("../controllers/project");
const project = new Project();

router.get("/project:id", (req, res) => {
  const proj_id = req.params.id;
  project.getProject(proj_id, (data) => {
    if (data) {
      res.render("viewproject", {
        id: data.projId || "",
        type: data.proj_type || "other",
        title: data.proj_title || "",
        details: data.proj_details || "",
        address: data.proj_address || "",
        city: data.proj_city || "",
        status: data.proj_status || "",
        worth: data.reward_points || 0,
        tools: data.proj_tools || "",
        current: data.current_workers || 0,
        maxworkers: data.max_no_workers || 1,
        postedby: data.posted_by || "",
        duration: data.estimated_duration || "unknown",
        image: data.proj_photo || "",
      });
    } else if (req.session.userid == "admin") {
      project.getProposedProject(proj_id, (data) => {
        if (data) {
          res.render("viewproject", {
            id: data.projId || "",
            type: data.proj_type || "other",
            title: data.proj_title || "",
            details: data.proj_details || "",
            address: data.proj_address || "",
            city: data.proj_city || "",
            status: data.proj_status || "",
            worth: data.reward_points || 0,
            tools: data.proj_tools || "",
            current: data.current_workers || 0,
            maxworkers: data.max_no_workers || 1,
            postedby: data.posted_by || "",
            duration: data.estimated_duration || "unknown",
            image: data.proj_photo || "",
          });
        }
      });
      return;
    } else {
      console.log("Project exists in Database but...");
      res.redirect("/projects");
    }
  });
});

//Load Projects
router.get("/allprojects", (req, res) => {
  project.allProjects((data) => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
  });
});

/* Get All user projects */
router.get("/getuserproject", (req, res) => {
  if (req.session.userid) {
    project.getUserProjects(req.session.userid, (data) => {
      if (data) {
        res.json(data.recordset);
      } else {
        res.json({ errMessage: "You have not enlisted for any projects" });
      }
    });
  }
});

/* Add user and project to worklist */
router.post("/enlist", (req, res) => {
  if (req.session.userid) {
    const proj = {
      userid: req.session.userid,
      projid: req.body.projid,
    };
    //getProject
    project.getProject(proj.projid, (projrecord) => {
      if (projrecord) {
        project.enlistWorker(projrecord, proj.userid, (rows) => {
          if (rows) {
            //if user is successfully added to list of workers
            res.json({ message: "You have been enlisted successfully" });
          } else if (rows === "complete") {
            res.json({
              errMessage: "This project has already been completed!",
            });
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
});

/*Remove user from worklist */
router.delete("/dropworker", (req, res) => {
  console.log(req.body.projid);
  if (req.session.userid) {
    project.dropWorker(req.body.projid, req.session.userid, (response) => {
      if (response) {
        res.json({
          message: "You have cancelled out of the project: " + req.body.projid,
        });
      } else {
        res.json({
          errMessage: "You have already been removed from this project",
        });
      }
    });
  } else {
    res.json({ errMessage: "you are not logged in" });
  }
});

/* increment current workers */
router.put("/currentworkers", (req, res) => {
  if (req.session.userid) {
    const proj = {
      userid: req.session.userid,
      projid: req.body.projid /* ? req.body.projid : "" */,
    };
    project.getProject(proj.projid, (projrecord) => {
      if (projrecord) {
        project.updateCurrentWorker(projrecord, (result) => {
          if (result) {
            res.json({ message: "Welcome aboard" });
          } else {
            res.json({
              errMessage:
                "Sorry, This Project has already been assigned/Completed!",
            });
          }
        });
      }
    });
  }
});

// Add Project
router.post("/addproject", upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return;
  }
  const { url: imageurl } = await cloudLink(req.file);
  if (req.session.userid) {
    // Everything went fine.
    // let imageurl = file.path;
    let proj = {
      type: req.body.type,
      title: req.body.title,
      tools: req.body.tools,
      details: req.body.details,
      address: req.body.address,
      city: req.body.city,
      duration: req.body.duration,
      maxworkers: parseInt(req.body.max, 10),
      image: imageurl,
      postedby: req.session.userid,
    };
    //add to database
    project.addProject(proj, (projectdata) => {
      if (projectdata) {
        res.json({
          message:
            "Your proposed project has been Received, Wait for approval!",
        });
      } else {
        res.json({ errMessage: "Could not add project" });
      }
    });
  } else {
    res.redirect("/login");
  }
});

//project view post
router.post("/projectview", (req, res) => {
  project.findProject(req.body.id, (projid) => {
    if (projid) {
      res.json({
        redirect_path: "/project" + projid,
      });
      return;
    } else if (req.session.userid == "admin") {
      //Admin: Check other table
      project.findProposedProject(req.body.id, (id) => {
        if (id) {
          console.log("found proposed proj");
          res.json({
            redirect_path: "/project" + id,
          });
        }
      });
      return;
    } else {
      res.json({ errMessage: "Cannot find project" });
    }
  });
});

router.put("/loadpoints", (req, res) => {
  project.distributePoints((response) => {
    if (response) {
      res.json({ message: "Your Reward Points have been added" });
      return;
    }
    res.json({ errMessage: "Projects are yet to be completed" });
  });
});

module.exports = router;
