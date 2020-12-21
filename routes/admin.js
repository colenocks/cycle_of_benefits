const express = require("express");
const router = express.Router();
const { multerUploads } = require("../middleware/multer");
const { verifyToken } = require("../middleware/is-auth");
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

router.get("/getusers", verifyToken, getUsers); //<-- yet to implement

router.get("/getallprojects", verifyToken, getAllProjects);

router.get("/getrewards", getRewardsRequests);

router.post("/approveproject", verifyToken, approveProject);

router.put(
  "/updateproject/:projId",
  verifyToken,
  multerUploads.single("image_url"),
  updateProject
);

router.delete("/archiveproject/:projId", verifyToken, archiveProject); //<-- yet to implement

router.delete("/deleteuser/:userId", verifyToken, deleteUser); //<-- yet to implement

router.delete("/deleteproject/:projId", verifyToken, deleteProject); //<-- yet to implement

module.exports = router;
