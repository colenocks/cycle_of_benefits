const dotenv = require("dotenv");
dotenv.config();
const { getDatabase } = require("../persistence/connection");
const bcrypt = require("bcryptjs");

const admin_username = process.env.ADMIN_USER;
const admin_password = process.env.ADMIN_PASSWORD;

exports.findUser = (userid, callback) => {
  if (userid) {
    const db = getDatabase();
    db.collection("users")
      .findOne({ username: userid })
      .then((user) => {
        if (user) {
          /****** returns BOTH the user _id and username *******/
          callback(user._id, user.username);
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log("findUser Error: " + err);
      });
  }
};

exports.createUser = (userobj, callback) => {
  this.findUser(userobj.username, (_id, username) => {
    if (_id) {
      console.log("Found User: " + _id);
      callback(null);
      return;
    }

    const hashedPassword = bcrypt.hashSync(userobj.password, 10);
    const newUser = { username: userobj.username, password: hashedPassword };
    const db = getDatabase();
    db.collection("users")
      .insertOne(newUser)
      .then((data) => {
        if (data.insertedCount == 1) {
          callback(data.insertedId);
          return;
        }
        callback(null);
      })
      .catch((err) => {
        console.log("Create Error: " + err);
      });
  });
};

exports.getLogin = (req, res) => {
  if (!req.session.userid) {
    res.render("login");
    return;
  }
  res.redirect("/dashboard");
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const db = getDatabase();
    db.collection("users")
      .findOne({ username })
      .then((userRecord) => {
        if (userRecord) {
          let validPassword = bcrypt.compareSync(password, userRecord.password);
          if (
            (username === admin_username && password === admin_password) ||
            validPassword
          ) {
            //on login, set user session
            req.session.userid = userRecord.username;
            res.json({
              redirect_path: "/dashboard",
            });
          } else {
            res.json({ errMessage: "Login Failed" });
          }
        } else {
          console.log("Login Post Err: user not found");
          res.json({ errMessage: "User not Found" });
        }
      })
      .catch((err) => {
        console.log("Login Error: " + err);
      });
  }
};

exports.getSignup = (req, res) => {
  res.render("register");
};

exports.postSignup = (req, res) => {
  const userObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };
  this.createUser(userObj, (newUserId) => {
    if (newUserId) {
      const newUserProfile = {
        username: userObj.username,
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        email: userObj.email,
        userId: newUserId,
      };

      const db = getDatabase();
      db.collection("profiles")
        .insertOne(newUserProfile)
        .then((data) => {
          if (data.insertedCount == 1) {
            console.log("new user created successfully");
            res.json({
              status: "Registeration Successful",
              redirect_path: "/login",
            });
          }
          res.json({ message: "Sorry! This User already exists" });
        })
        .catch((err) => {
          console.log("Save Profile Error: " + err);
        });
    } else {
      console.log("Error: Unable to create user");
    }
  });
};

exports.getUserSession = (req, res) => {
  if (req.session.userid) {
    res.json({ session: req.session.userid });
    return;
  }
  res.json({ errMessage: "Session expired, Login" });
};

exports.isLoggedIn = (req, res) => {
  if (req.session.userid) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  if (req.session.userid) {
    req.session.destroy(() => res.redirect("/"));
  } else {
    res.redirect("/login");
  }
};
