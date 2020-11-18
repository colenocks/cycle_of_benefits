const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");
const user = new User();

const admin_username = process.env.ADMIN_USER;

exports.getUserProfile = (req, res) => {
  if (req.session.userid) {
    if (req.session.userid === admin_username) {
      res.render("admincontrol");
    } else {
      //get userdata and render profile
      user.getProfile(req.session.userid, (userprofile) => {
        if (userprofile) {
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
        }
        console.log("*getuserprofile* Error: Could not find user profile");
      });
    }
  } else {
    res.redirect("/login");
  }
};

exports.updateUserProfile = (req, res) => {
  const profile = {
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone,
    state: req.body.state,
    nationalId: req.body.nationalId,
  };
  user.updateProfile(profile.username, profile, (updated) => {
    if (updated) {
      res.json({
        message: "Profile successfully updated",
      });
    } else {
      res.json({ errMessage: "Could not update profile from server" });
    }
  });
};

exports.redeemReward = (req, res) => {
  if (req.session.userid) {
    let reward = {
      used: parseInt(req.body.used, 10),
      // total: parseInt(req.body.total, 10),
      benefit: req.body.benefit,
    };
    user.useReward(req.session.userid, reward, (rewardused) => {
      if (rewardused) {
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
};
