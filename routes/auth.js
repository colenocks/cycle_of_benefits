const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  postSignup,
  getSignup,
  logout,
  getUserSession,
  isLoggedIn,
} = require("../controllers/auth");

router.get("/login", getLogin);

router.get("/register", getSignup);

router.post("/login", postLogin);

router.post("/submitregister", postSignup);

router.get("/usersession", getUserSession);

router.get("/login-check", isLoggedIn);

router.get("/logout", logout);

module.exports = router;
