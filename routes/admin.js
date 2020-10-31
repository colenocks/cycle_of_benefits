const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  approveProjects,
  showUsers,
  updateProjects,
  archiveProject,
  showRedeemedRewards,
  removeUser,
  removeProject,
} = require("../controllers/admin");

router.get("/showusers", showUsers);

router.get("/getallprojects", getAllProjects);

router.post("/approveproject", approveProjects);

router.put("/updateproject", updateProjects);

router.delete("/archiveproject", archiveProject);

router.get("/showrewards", showRedeemedRewards);

router.delete("/removeuser", removeUser);

router.delete("/removeproject", removeProject);

module.exports = router;
