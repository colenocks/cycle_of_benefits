const dotenv = require("dotenv");
dotenv.config();
const { getDatabase } = require("../persistence/connection");

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
  const userProfile = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone,
    state: req.body.state,
    nationalId: req.body.nationalId,
  };
  auth.findUser(req.body.username, (id, username) => {
    if (id || username) {
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
  const userid = req.sessionId;
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
