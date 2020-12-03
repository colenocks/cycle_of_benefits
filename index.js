"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const mainRoutes = require("./routes/main");

const hostname = process.env.LOCAL_HOST;
const port = process.env.LOCAL_PORT;

const { mongoConnect } = require("./persistence/connection");

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine set up
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
      sameSite: true,
      // secure: process.env.IN_PROD
    },
  })
);

//CORS SETUP
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// OR
app.use(cors());

//Register routes
app.use(adminRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(projectRoutes);
app.use(mainRoutes);

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

//connect to server only when connection to the database is established
mongoConnect((err, client) => {
  if (err) {
    console.log("Connection to DB unsuccessful");
  }
  app.listen(port, () =>
    console.log(`Listening at ${hostname} on port:${port}`)
  );
});

module.exports = app;
