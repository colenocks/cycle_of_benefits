const express = require("express");
const router = express.Router();
// const { upload } = require("../persistence/cloudinary");
const { multerUploads } = require("../middleware/multer");
const { verifyToken } = require("../middleware/is-auth");

const {
  getProject,
  getAllProjects,
  enlistWorker,
  dropWorker,
  addProject,
  loadPoints,
} = require("../controllers/project");

router.get("/projects/:id", getProject);

router.get("/projects", getAllProjects);

router.post("/enlist", verifyToken, enlistWorker);

router.delete("/dropworker/:id", verifyToken, dropWorker);

router.post(
  "/addproject",
  verifyToken,
  multerUploads.single("image_url"),
  addProject
);

router.get("/loadpoints", verifyToken, loadPoints);

module.exports = router;
