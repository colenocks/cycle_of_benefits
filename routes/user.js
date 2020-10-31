const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  redeemReward,
} = require("../controllers/user");

router.get("/profile", getUserProfile);

router.put("/updateuser", updateUserProfile);

router.put("/redeemreward", redeemReward);

module.exports = router;
