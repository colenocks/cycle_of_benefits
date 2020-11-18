const express = require("express");
const router = express.Router();
const { upload } = require("../persistence/cloudinary");

const {
  getProject,
  getAllProjects,
  getUserProjects,
  enlistWorker,
  dropWorker,
  addProject,
  viewProject,
  loadPoints,
} = require("../controllers/project");

router.get("/project/:id", getProject);

router.get("/getprojects", getAllProjects);

router.get("/getuserproject", getUserProjects);

router.post("/enlist", enlistWorker);

router.delete("/dropworker", dropWorker);

router.post("/addproject", upload.single("image"), addProject);

router.post("/projectview", viewProject);

router.put("/loadpoints", loadPoints);

module.exports = router;
