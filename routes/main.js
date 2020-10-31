const express = require("express");

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

module.exports = router;
