require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SESS_SECRET;
const DB_ADMIN = process.env.ADMIN_ROLE;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({ errMessage: "Not Authenticated.", status: 401 });
    return;
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.json({
        errMessage: "Authorization Failed, No token provided!",
      });
      console.log("Authorization Failed, No token provided!", 403);
      return;
    }

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.json({ errMessage: "You are not logged in.", status: 500 });
        console.log("Verification failed.", 500);
        return;
      }
      req.sessionId = decodedToken.username;
      next();
    });
  }
};

exports.checkAdminRole = (req, res, next) => {
  const role = req.role;
  console.log("checkRole", role);
  if (!role || role !== DB_ADMIN) {
    throwError("Not Authorized", 403);
  }
  next();
};
