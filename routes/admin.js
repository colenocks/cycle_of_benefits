const express = require("express");
const router = express.Router();

const {
  getProjects,
  approveProject,
  getUsers,
  updateProject,
  archiveProject,
  getRewardsRequests,
  deleteUser,
  deleteProject,
} = require("../controllers/admin");

router.get("/getusers", getUsers);

router.get("/getallprojects", getProjects);

router.post("/approveproject", approveProject);

router.put("/updateproject", updateProject);

router.delete("/archiveproject", archiveProject);

router.get("/getrewards", getRewardsRequests);

router.delete("/deleteuser", deleteUser);

router.delete("/deleteproject", deleteProject);

module.exports = router;
