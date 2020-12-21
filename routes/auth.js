const express = require("express");
const router = express.Router();
const { postLogin, postSignup } = require("../controllers/auth");

router.post("/login", postLogin);

router.post("/signup", postSignup);

module.exports = router;
