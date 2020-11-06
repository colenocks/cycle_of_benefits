const User = require("../models/user");
const user = new User();

exports.getLogin = (req, res) => {
  if (!req.session.userid) {
    res.render("login");
    return;
  }
  res.redirect("/profile");
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    user.login(username, password, (id) => {
      if (id) {
        //on login, set a session variable
        req.session.userid = id;
        res.json({
          redirect_path: "/profile",
        });
      } else {
        res.status(404).json({ errMessage: "Login Failed" });
        console.log("Login Post Err: user not found");
      }
    });
  }
};

exports.getSignup = (req, res) => {
  res.render("register");
};

exports.postSignup = (req, res) => {
  // console.log(req.body);
  let userObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };
  user.createUser(userObj, (data) => {
    if (data) {
      console.log("new user created successfully");
      res.json({
        status: "Registeration Successful",
        redirect_path: "/login",
      });
    } else {
      console.log("Error: Unable to create user");
      res.json({ message: "Sorry! This User already exists" });
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
  }
};
