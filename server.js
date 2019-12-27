"use strict";
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mainRouter = require("./routes/main_routes");
const path = require("path");
// const serveStatic = require('serve-static')
const session = require("express-session");
const HALF_HOUR = 1000 * 60 * 30; //30 minutes

const {
  PORT = process.env.PORT ? process.env.PORT : 1433,
  NODE_ENV = "development",
  SESS_SECRET = "cyob//!Icardi?!",
  SESS_LIFETIME = HALF_HOUR
} = process.env;

const IN_PROD = NODE_ENV === "production";

app.use(express.static("dist"));
app.use(express.static("assets"));
// Virtual Path Prefix '/static'
// app.use('/images', express.static('public'))
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").__express);
app.set("view engine", "html");
app.set("view engine", "ejs");

// Session Custom options
app.use(
  session({
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    }
  })
);

//user routes
app.use("/", mainRouter);

// Errors : Page not found
app.use((req, res, next) => {
  var err = new Error("Page not found");
  err.status = 404;
  next(err);
});

//Handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

function hi() {
  alert("I can see you");
}

module.exports = app;
