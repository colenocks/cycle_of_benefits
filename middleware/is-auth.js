require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SESS_SECRET;
const DB_ADMIN = process.env.ADMIN_ROLE;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({ errMessage: "Not Authenticated.", status: 401 });
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.json({
        errMessage: "Authorization Failed, No token provided!",
        status: 403,
      });
    }

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.json({ errMessage: "Verification failed.", status: 500 });
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
