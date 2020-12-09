const express = require("express");
const router = express.Router();
const { upload } = require("../persistence/cloudinary");

const {
  getProject,
  getAllProjects,
  enlistWorker,
  dropWorker,
  addProject,
  viewProject,
  loadPoints,
} = require("../controllers/project");

router.get("/projects/:id", getProject);

router.get("/projects", getAllProjects);

router.post("/enlist", enlistWorker);

router.delete("/dropworker/:id", dropWorker);

router.post("/addproject", upload.single("image"), addProject);

router.post("/projectview", viewProject);

router.put("/loadpoints", loadPoints);

module.exports = router;
