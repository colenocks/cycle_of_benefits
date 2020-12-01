const dotenv = require("dotenv");
dotenv.config();
const { getDatabase } = require("../persistence/connection");
const bcrypt = require("bcryptjs");

const auth = require("./auth");

const admin_username = process.env.ADMIN_USER;
const admin_password = process.env.ADMIN_PASSWORD;

exports.getUserProfile = (req, res) => {
  const userid = req.session.userid;
  if (userid) {
    if (userid === admin_username) {
      res.render("/admincontrol");
      // res.json({redirect_path: "/admin"});
    } else {
      //get userdata and render profile
      const db = getDatabase();
      db.collection("profiles")
        .findOne({ username: userid })
        .then((userprofile) => {
          if (userprofile) {
            // res.json({userprofile});
            res.render("profile", {
              username: userprofile.username || "",
              firstname: userprofile.firstname || "",
              lastname: userprofile.lastname || "",
              email: userprofile.email || "",
              age: userprofile.dob || "",
              address: userprofile.address || "",
              phone: userprofile.phone || "",
              nationalId: userprofile.nationalId || "",
              state: userprofile.state || "",
              points: userprofile.points || "0",
            });
            return;
          } else {
            res.json({ errMessage: "Could not find user profile" });
          }
        })
        .catch((err) => {
          console.log("get Profile Error: " + err);
        });
    }
  } else {
    res.redirect("/login");
  }
};

exports.updateUserProfile = (req, res) => {
  const userProfile = {
    username: req.body.username,
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone,
    state: req.body.state,
    nationalId: req.body.nationalId,
  };
  auth.findUser(req.body.username, (id, username) => {
    if (id) {
      const db = getDatabase();
      db.collection("profiles")
        .updateOne({ userId: id }, { $set: userProfile })
        .then((data) => {
          if (data.result.nModified == 1) {
            res.json({
              message: "Profile successfully updated",
            });
          } else {
            res.json({ errMessage: "Could not update profile from server" });
          }
        });
    } else {
      res.json({ errMessage: "User not Found!" });
    }
  });
};

exports.redeemReward = (req, res) => {
  const userid = req.session.userid;
  if (userid) {
    const reward = {
      benefit: req.body.benefit,
      used: parseInt(req.body.used, 10),
      // total: parseInt(req.body.total, 10),
    };
    this.uploadRequest(userid, reward, (id) => {
      if (id) {
        //Update user points
        const db = getDatabase();
        db.collection("profiles")
          .updateOne({ userId: userid }, { $inc: { points: -reward.used } })
          .then((data) => {
            if (data.result.nModified >= 1) {
              res.json({
                message:
                  "You have successfully purchased " +
                  reward.benefit +
                  "benefits with " +
                  reward.used +
                  ". Check your email for instructions on how to redeem",
              });
            } else {
              res.json({
                errMessage:
                  "Something went wrong with getting your reward, Try again",
              });
            }
          });
      }
    });
  }
};

exports.uploadRequest = (userid, rewardObj, callback) => {
  //check if user has reward points attached in worklist
  const db = getDatabase();
  const requestedReward = {
    userId: userid,
    points_used: rewardObj.used,
    reward_type: rewardObj.benefit,
  };
  db.collection("reward_requests")
    .insertOne(requestedReward)
    .then((data) => {
      if (data.result.insertedCount >= 1) {
        callback(userid);
        return;
      }
      callback(null);
    })
    .catch((err) => console.log("upload Request: " + err));
};
