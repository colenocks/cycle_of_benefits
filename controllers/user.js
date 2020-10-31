const User = require("../models/user");
const user = new User();

exports.getUserProfile = (req, res) => {
  if (req.session.userid) {
    if (req.session.userid === "admin") {
      res.render("admincontrol");
    } else {
      //get userdata and render profile
      user.getProfile(req.session.userid, (userprofile) => {
        if (userprofile) {
          res.render("profile", {
            username: userprofile.userId || "",
            firstname: userprofile.first_name || "",
            lastname: userprofile.last_name || "",
            email: userprofile.email_address || "",
            age: userprofile.date_of_birth || "",
            address: userprofile.home_address || "",
            phone: userprofile.mobile_number || "",
            nationalId: userprofile.nationalId || "",
            state: userprofile.state_of_origin || "",
            points: userprofile.user_reward_points || "0",
          });
          return;
        }
        console.log("profile route Error: Could not find user profile");
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
  user.updateProfile(profile.username, profile, (response) => {
    if (response) {
      console.log(response + "row(s) affected.");
      res.json({
        message: "Profile successfully updated",
      });
    } else {
      console.log("Put: Could not update profile");
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
            "You have successfully redeemed " +
            reward.used +
            " points in " +
            reward.benefit +
            " benefits .\n Check your email on instructions on how to collect",
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
