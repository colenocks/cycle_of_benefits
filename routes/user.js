const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  redeemReward,
  getUserProjects,
} = require("../controllers/user");

router.get("/profile/:userId", getUserProfile);

router.get("/myprojects/:userId", getUserProjects);

router.put("/profile", updateUserProfile);

router.put("/redeemreward", redeemReward);

module.exports = router;
