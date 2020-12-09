const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  approveProject,
  getUsers,
  updateProject,
  archiveProject,
  getRewardsRequests,
  deleteUser,
  deleteProject,
} = require("../controllers/admin");

router.get("/getusers", getUsers);

router.get("/getallprojects", getAllProjects);

router.post("/approveproject", approveProject);

router.put("/updateproject", updateProject);

router.delete("/archiveproject", archiveProject);

router.get("/getrewards", getRewardsRequests);

router.delete("/deleteuser", deleteUser);

router.delete("/deleteproject", deleteProject);

module.exports = router;
