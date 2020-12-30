const dotenv = require("dotenv");
dotenv.config();
const { getDatabase } = require("../database/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { filterEmptyValues, formatStringFields } = require("../util/utility");

exports.findUser = (username, callback) => {
  if (username) {
    const db = getDatabase();
    db.collection("profiles")
      .findOne({ username: username })
      .then((user) => {
        if (user) {
          callback(user);
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
  this.findUser(userobj.username, (user) => {
    if (user) {
      console.log("Found User: ", user);
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

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const db = getDatabase();
    db.collection("users")
      .findOne({ username })
      .then((userRecord) => {
        if (userRecord) {
          let validPassword = bcrypt.compareSync(password, userRecord.password);
          if (validPassword) {
            req.sessionId = userRecord.username;
            req.role = userRecord.role;
            //create a new signature
            const token = jwt.sign(
              {
                username: userRecord.username,
                userId: userRecord._id.toString(),
                role: userRecord.role,
              },
              process.env.SESS_SECRET,
              { expiresIn: process.env.SESS_LIFETIME }
            );
            res.json({
              token: token,
              sessionId: userRecord.username,
              role: userRecord.role,
              message: "Login Successful",
            });
          } else {
            res.json({ errMessage: "Login Failed" });
          }
        } else {
          res.json({ errMessage: "User not Found" });
        }
      })
      .catch((err) => {
        console.log("Login Error: " + err);
      });
  }
};

exports.postSignup = (req, res) => {
  const userObj = filterEmptyValues(req.body);
  if (userObj.length < req.body.length) {
    res.json({ errMessage: "All fields are required to be filled." });
    return;
  }
  const { password, confirm_password } = req.body;
  if (password !== confirm_password) {
    res.json({ errMessage: "Passwords do not match." });
    return;
  }

  const user = formatStringFields(req.body);
  this.createUser(user, (newUserId) => {
    if (newUserId) {
      const newUserProfile = {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userId: newUserId,
      };

      const db = getDatabase();
      db.collection("profiles")
        .insertOne(newUserProfile)
        .then((data) => {
          if (data.insertedCount === 1) {
            console.log("new user created successfully");
            res.json({
              sessionId: data.insertedId,
              message: "Registeration Successful",
              redirect_path: "/login",
            });
            return;
          }
          console.log("Error: Unable to create user");
        })
        .catch((err) => {
          console.log("Save Profile Error: " + err);
        });
    } else {
      res.json({ errMessage: "Sorry! The username has been taken" });
    }
  });
};
