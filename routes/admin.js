const express = require("express");
const router = express.Router();
// const { upload } = require("../persistence/cloudinary");
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

router.get("/getusers", verifyToken, getUsers);

router.get("/getallprojects", verifyToken, getAllProjects);

router.get("/getrewards", getRewardsRequests);

router.post("/approveproject", verifyToken, approveProject);

router.put(
  "/updateproject/:projId",
  verifyToken,
  multerUploads.single("image_url"),
  updateProject
);

router.delete("/archiveproject/:projId", verifyToken, archiveProject);

router.delete("/deleteuser/:userId", verifyToken, deleteUser);

router.delete("/deleteproject/:projId", verifyToken, deleteProject);

module.exports = router;
