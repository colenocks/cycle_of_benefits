const dotenv = require("dotenv");
dotenv.config();
const { getDatabase } = require("../database/connection");
const { filterEmptyData } = require("../util/utility");

const auth = require("./auth");

exports.getUserProfile = (req, res) => {
  // const userId = req.sessionId;
  const userId = req.params.userId;
  if (userId) {
    const db = getDatabase();
    db.collection("profiles")
      .findOne({ username: userId })
      .then((userProfile) => {
        if (userProfile) {
          res.json(userProfile);
          return;
        } else {
          res.json({ errMessage: "Could not find user profile" });
        }
      })
      .catch((err) => {
        console.log("Get Profile Error: " + err);
      });
  }
};

exports.updateUserProfile = (req, res) => {
  const userProfile = filterEmptyData(req.body);
  const userId = req.sessionId;
  if (userId) {
    console.log(userProfile);
    const db = getDatabase();
    db.collection("profiles")
      .updateOne({ username: userId }, { $set: userProfile })
      .then((data) => {
        if (data.result.nModified == 1) {
          auth.findUser(userId, (user) => {
            if (user) {
              res.json({
                message: "Profile successfully updated",
                updated_current_user: user,
              });
            }
          });
        } else {
          res.json({ errMessage: "Could not update profile from server" });
        }
      });
  } else {
    res.json({ errMessage: "User not Found!" });
  }
};

exports.getUserProjects = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    const db = getDatabase();
    try {
      const projects = await db
        .collection("worklist")
        .aggregate([
          {
            $lookup: {
              from: "active_projects",
              let: { userId: "$userId", projectId: "$projectId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$projectId"] },
                        { $eq: [userId, "$$userId"] },
                      ],
                    },
                  },
                },
              ],
              as: "user_projects",
            },
          },
        ])
        .toArray();
      if (projects) {
        res.json(projects);
      } else {
        res.json({ errMessage: "You have not enlisted for any projects" });
      }
    } catch (err) {
      console.log("getuser: ", err);
    }
  }
};

exports.redeemReward = (req, res) => {
  const userId = req.sessionId;
  if (userId) {
    const { used_points, benefit_type, total_points } = req.body;
    const used = parseInt(used_points, 10);
    const total = parseInt(total_points, 10);
    if (used > total || total === 0) {
      res.json({
        errMessage: "You have insufficient points, earn more points",
      });
      return;
    }
    if (used === 0) {
      res.json({
        errMessage:
          "Select the number of points and benefit you want to redeem",
      });
      return;
    }

    const rewardData = {
      benefit_type,
      used_points: used,
    };
    uploadRequest(userId, rewardData, (id) => {
      if (id) {
        //Update user points
        const db = getDatabase();
        db.collection("profiles")
          .updateOne(
            { username: userId },
            { $inc: { points: -rewardData.used_points } }
          )
          .then((data) => {
            if (data.result.nModified > 0) {
              db.collection("profiles")
                .findOne({ username: userId })
                .then((userData) => {
                  res.json({
                    message:
                      "You have successfully purchased " +
                      rewardData.benefit_type +
                      " with " +
                      rewardData.used_points +
                      " points. Check your email for instructions on how to redeem",
                    userData: userData,
                  });
                });
            } else {
              res.json({
                errMessage:
                  "Something went wrong with getting your reward, Try again",
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  }
};

const uploadRequest = (userId, rewardObj, callback) => {
  //check if user has reward points attached in worklist
  const db = getDatabase();
  const requestedReward = {
    userId: userId,
    used_points: rewardObj.used_points,
    benefit_type: rewardObj.benefit_type,
  };
  db.collection("reward_requests")
    .insertOne(requestedReward)
    .then((data) => {
      if (data.result.n === 1) {
        callback(userId);
        return;
      }
      callback(null);
    })
    .catch((err) => console.log("upload Request: " + err));
};
