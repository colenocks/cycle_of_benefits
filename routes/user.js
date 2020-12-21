const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/is-auth");

const {
  getUserProfile,
  updateUserProfile,
  redeemReward,
  getUserProjects,
} = require("../controllers/user");

router.get("/profile/:userId", getUserProfile);

router.get("/myprojects/:userId", getUserProjects);

router.put("/profile", verifyToken, updateUserProfile);

router.put("/redeemreward", verifyToken, redeemReward);

module.exports = router;
