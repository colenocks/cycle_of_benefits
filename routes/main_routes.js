const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const User = require("../persistence/user");
const Project = require("../persistence/project");
const Control = require("../persistence/control");
const multer = require("multer");
const cloudinary = require("../persistence/cloudinary");

dotenv.config();

//using the diskStorage option instead of dest to have full control uploaded images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "projects");
  },
  filename: function(req, file, cb) {
    // the null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MULTER_FILE_SIZE, 10)
  },
  fileFilter: function(req, file, cb) {
    cloudinary.checkFileType(file, cb);
  }
});

const router = express.Router();

/*Database queries Constructors/Objects */
const user = new User();
const project = new Project();
const control = new Control();

//get index page
router.get("/", (req, res, next) => {
  // console.log(req.session.userid + ": " + req.session.cookie.maxAge);
  res.render("index");
});

router.get("/usersession", (req, res) => {
  if (req.session.userid) {
    res.json({ session: req.session.userid });
    return;
  }
  res.json({ errMessage: "Session expired, Login" });
});

router.get("/projects", (req, res) => {
  res.render("projects");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  if (!req.session.userid) {
    res.render("login");
    return;
  }
  res.redirect("/profile");
});

router.get("/project:id", (req, res, next) => {
  const proj_id = req.params.id;
  project.getProject(proj_id, data => {
    if (data) {
      res.render("viewproject", {
        id: data.projId ? data.projId : "",
        type: data.proj_type ? data.proj_type : "other",
        title: data.proj_title ? data.proj_title : "",
        details: data.proj_details ? data.proj_details : "",
        address: data.proj_address ? data.proj_address : "",
        city: data.proj_city ? data.proj_city : "",
        status: data.proj_status ? data.proj_status : "",
        worth: data.reward_points ? data.reward_points : 0,
        tools: data.proj_tools ? data.proj_tools : "",
        current: data.current_workers ? data.current_workers : 0,
        maxworkers: data.max_no_workers ? data.max_no_workers : 1,
        postedby: data.posted_by ? data.posted_by : "",
        duration: data.estimated_duration ? data.estimated_duration : "unknown",
        image: data.proj_photo ? data.proj_photo : ""
      });
      return;
    }
    console.log("Project exists in Database but without parameter");
    res.redirect("/projects");
  });
});

router.get("/profile", (req, res) => {
  if (req.session.userid) {
    if (req.session.userid === "admin") {
      res.render("admincontrol");
    } else {
      //get userdata and render profile
      user.getProfile(req.session.userid, userprofile => {
        if (userprofile) {
          res.render("profile", {
            username: userprofile.userId ? userprofile.userId : "",
            firstname: userprofile.first_name ? userprofile.first_name : "",
            lastname: userprofile.last_name ? userprofile.last_name : "",
            email: userprofile.email_address ? userprofile.email_address : "",
            age: userprofile.date_of_birth ? userprofile.date_of_birth : "",
            address: userprofile.home_address ? userprofile.home_address : "",
            phone: userprofile.mobile_number ? userprofile.mobile_number : "",
            nationalId: userprofile.nationalId ? userprofile.nationalId : "",
            state: userprofile.state_of_origin
              ? userprofile.state_of_origin
              : "",
            points: userprofile.user_reward_points
              ? userprofile.user_reward_points
              : "0"
          });
          return;
        }
        console.log("profile route Error: Could not find user profile");
      });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.put("/updateuser", (req, res) => {
  const profile = {
    username: req.body.username,
    fname: req.body.fname /* ? req.body.fname : "" */,
    lname: req.body.lname /* ? req.body.lname : "" */,
    email: req.body.email /* ? req.body.email : "" */,
    dob: req.body.dob /* ? req.body.dob : "" */,
    address: req.body.address /* ? req.body.address : "" */,
    phone: req.body.phone /* ? req.body.phone : "" */,
    state: req.body.state /* ? req.body.state : "" */,
    nationalId: req.body.nationalId /*? req.body.nationalId : "" */
  };
  user.updateProfile(profile.username, profile, response => {
    if (response) {
      console.log(response + "row(s) affected.");
      res.json({
        message: "Profile successfully updated"
      });
    } else {
      console.log("Put: Could not update profile");
      res.json({ errMessage: "Could not update profile from server" });
    }
  });
});

//Load Projects
router.get("/allprojects", (req, res) => {
  project.allProjects(data => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
  });
});

/* Add user and project to worklist */
router.post("/enlist", (req, res) => {
  if (req.session.userid) {
    const proj = {
      userid: req.session.userid,
      projid: req.body.projid
    };
    //getProject
    project.getProject(proj.projid, projrecord => {
      if (projrecord) {
        project.enlistWorker(projrecord, proj.userid, rows => {
          if (rows) {
            //if user is successfully added to list of workers
            res.json({ message: "You have been enlisted successfully" });
          } else {
            res.json({
              errMessage:
                "You have already been listed as a worker for this project!"
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

/* Get All user projects */
router.get("/getuserproject", (req, res) => {
  if (req.session.userid) {
    project.getUserProjects(req.session.userid, data => {
      if (data) {
        res.json(data.recordset);
      } else {
        res.json({ errMessage: "You have not enlisted for any projects" });
      }
    });
  }
});

/*Remove user from worklist */
router.delete("/dropworker", (req, res) => {
  if (req.session.userid) {
    project.dropWorker(req.body.projid, req.session.userid, response => {
      if (response) {
        res.json({
          message: "You have cancelled out of the project: " + req.body.projid
        });
      } else {
        res.json({
          errMessage: "You have already been removed from this project"
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
      projid: req.body.projid /* ? req.body.projid : "" */
    };
    project.getProject(proj.projid, projrecord => {
      if (projrecord) {
        project.updateCurrentWorker(projrecord, result => {
          if (result) {
            res.json({ message: "All clear for enlisting" });
          } else {
            res.json({
              errMessage: "Sorry, This Project has already been assigned!"
            });
          }
        });
      }
    });
  }
});

//project view post
router.post("/projectview", (req, res) => {
  project.findProject(req.body.id, projid => {
    if (projid) {
      res.json({
        redirect_path: "/project" + projid
      });
    } else {
      res.json({ errMessage: "Cannot find project" });
    }
  });
});

//Image upload middleware
const cloudLink = async file => {
  try {
    // Upload file to cloudinary
    const uploader = async path => cloudinary.uploads(path, "cyob_images");
    const { path } = file;
    const url = await uploader(path);
    fs.unlinkSync(path);

    return url;
  } catch (error) {
    return {
      status: "Request failed",
      error
    };
  }
};

// Add Project
router.post("/addproject", upload.single("image"), async (req, res, next) => {
  if (!req.file) {
    console.log("No file uploaded");
    return;
  }
  // console.log(req.file);
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
      postedby: req.session.userid
    };
    // console.log(proj);
    //add to database
    project.addProject(proj, projectdata => {
      if (projectdata) {
        res.json({ message: "Project has been Submitted!" });
      } else {
        res.json({ errMessage: "Could not add project" });
      }
    });
  } else {
    res.redirect("/login");
  }
});

//login Post
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    user.login(username, password, id => {
      if (id) {
        //on login, make a session
        // req.session.name = userdata.first_name + " " + userdata.last_name;
        req.session.userid = id;
        res.json({
          redirect_path: "/profile"
        });
      } else {
        res.status(404).json({ errMessage: "Login Failed" });
        console.log("Login Post Err: user not found");
      }
    });
  }
});

//register post
router.post("/submitregister", (req, res) => {
  // console.log(req.body);
  let userObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  };
  user.createProfile(userObj, data => {
    if (data) {
      console.log(data + " user created");
      res.json({
        status: "Registeration Successful",
        redirect_path: "/login"
      });
    } else {
      console.log("Error: Unable to create user");
      res.json({ message: "Sorry! This User already exists" });
    }
  });
});

router.get("/login-check", (req, res) => {
  if (req.session.userid) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

router.put("/redeemreward", (req, res) => {
  if (req.session.userid) {
    let reward = {
      used: parseInt(req.body.used, 10),
      // total: parseInt(req.body.total, 10),
      benefit: req.body.benefit
    };
    user.useReward(req.session.userid, reward, rewardused => {
      if (rewardused) {
        res.json({
          message:
            "You have successfully redeemed " +
            reward.used +
            " points in " +
            reward.benefit +
            " benefits .\n Check your email on instructions on how to collect"
        });
      } else {
        res.json({
          errMessage: "Something went wrong with getting your reward, Try again"
        });
      }
    });
  }
});

router.put("/loadpoints", (req, res) => {
  project.distributePoints(response => {
    if (response) {
      res.json({ message: "Your Reward Points have been added" });
      return;
    }
    res.json({ errMessage: "Projects are yet to be completed" });
  });
});

// Get logout page
router.get("/logout", (req, res) => {
  // Check if the session is exist
  if (req.session.userid) {
    // destroy the session and redirect the user to the index page.
    req.session.destroy(function() {
      res.redirect("/");
    });
  }
});
/**************************************************/
/* Admin Routes */
/**************************************************/

/* showAllusers */
router.get("/showusers", (req, res) => {});

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
    maxworkers: parseInt(req.body.maxworkers, 10)
  };
  project.updateProject(proj, updated => {
    if (updated) {
      res.json({ message: proj.id + " has been successfully updated" });
      return;
    }
    res.json({ errMessage: "Could not update project" });
  });
});

/* archiveProject */
router.delete("/archiveproject", (req, res) => {
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
});

/* showAllRedeemedRewards */
router.get("/showrewards", (req, res) => {
  control.getAllRewardRequests(data => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({
      errMessage: "could not display rewards table"
    });
  });
});

/* RemoveUser */
router.delete("/removeuser", (req, res) => {
  user.find(req.body.userid, id => {
    if (id) {
      control.removeUser(req.body.userid, deleted => {
        if (deleted) {
          res.json({ message: "User Deleted" });
          return;
        }
        res.json({
          errMessage: "User was not deleted"
        });
      });
    } else {
      res.json({
        errMessage: "This user does not exist"
      });
    }
  });
});

/* RemoveProject */
router.delete("/removeproject", (req, res) => {
  project.findProject(req.body.projid, id => {
    if (id) {
      control.removeProject(req.body.projid, removed => {
        if (removed) {
          res.json({ message: "Project removed" });
          return;
        }
        res.json({
          errMessage: "Error with removing project"
        });
      });
    } else {
      res.json({
        errMessage: "This project does not exist"
      });
    }
  });
});

/* Add project point */
/* router.put("/addpoint", (req, res) => {
  const project = {
    point: req.body.point,
    duration: req.body.duration
  };
  control.addProjectPoint(project, added => {
    if (added) {
      res.json({ message: "Points and duration have been added to project" });
      return;
    }
    res.json({
      errMessage: "Points/Project Duration were not added to project"
    });
  });
}); */

module.exports = router;
