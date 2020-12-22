"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const path = require("path");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");

const port = process.env.PORT;

const { mongoConnect } = require("./database/connection");

// Parse Data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//Register routes
app.use(adminRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(projectRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

//connect to server only when connection to the database is established
mongoConnect((err, client) => {
  if (err) {
    console.log("Connection to DB unsuccessful");
  }
  app.listen(port, () => console.log(`Listening on port:${port}`));
});

module.exports = app;
