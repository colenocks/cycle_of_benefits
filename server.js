"use strict";
require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mainRouter = require("./routes/main_routes");
const path = require("path");
const session = require("express-session");

const hostname = process.env.HOST;
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "dist")));
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
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESS_LIFETIME, 10),
      sameSite: true
      // secure: process.env.IN_PROD
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

app.listen(port, () => console.log(`listening at ${hostname} on port:${port}`));

module.exports = app;
