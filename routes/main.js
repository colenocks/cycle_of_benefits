const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/projects", (req, res) => {
  res.render("projects");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/login", (req, res) => {
  if (!req.session.userid) {
    res.render("login");
    return;
  }
  res.redirect("/profile");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/usersession", (req, res) => {
  if (req.session.userid) {
    res.json({ session: req.session.userid });
    return;
  }
  res.json({ errMessage: "Session expired, Login" });
});

router.get("/login-check", (req, res) => {
  if (req.session.userid) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

// logout page
router.get("/logout", (req, res) => {
  if (req.session.userid) {
    req.session.destroy(function () {
      res.redirect("/");
    });
  }
});

module.exports = router;
