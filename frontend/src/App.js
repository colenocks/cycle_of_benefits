import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import Signup from "./components/Form/Signup/Signup";
import About from "./components/About/About";
import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";
import ProjectList from "./components/ProjectList/ProjectList";
import Contact from "./components/Contact/Contact";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import axios from "axios";
import "./App.css";

const { toast } = window.M;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      isAdmin: false,
      token: null,
      sessionId: null,
      projects: [],
      project: {},
      user_projects: [],
      current_user: {},
    };
  }

  componentDidMount() {
    this.getApprovedProjectsHandler();
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const sessionId = localStorage.getItem("sessionId");
    const role = localStorage.getItem("role");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    if (token || sessionId) {
      this.setState({
        isAuth: true,
        token: token,
        sessionId: sessionId,
        isAdmin: role ? true : false,
      });
    }
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    this.setAutoLogout(remainingMilliseconds);
  }

  loginHandler = (event, inputFields) => {
    event.preventDefault();
    const url = "http://localhost:5000/login";
    const user = {
      username: inputFields.username,
      password: inputFields.password,
    };
    axios
      .post(url, user)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        toast({ html: "Login Successful" });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("sessionId", res.data.sessionId);
        localStorage.setItem("role", res.data.role);

        this.setState(
          {
            isAuth: true,
            sessionId: res.data.sessionId,
            token: res.data.token,
            userId: res.data.userId,
            isAdmin: res.data.role ? true : false,
          },
          () => {
            this.state.isAdmin
              ? this.props.history.push("/admin")
              : this.props.history.push("/dashboard");
          }
        );

        const remainingMilliseconds = 60 * 30 * 1000; //30minutes
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());

        this.setAutoLogout(remainingMilliseconds);
      })
      .catch((error) => {
        console.error("Login Error: ", error);
        this.setState({
          isAuth: false,
          isAdmin: false,
          errMessage: error,
        });
      });
  };

  signupHandler = (event, inputFields) => {
    event.preventDefault();
    const url = "http://localhost:5000/signup";
    const user = {
      username: inputFields.username,
      password: inputFields.password,
      confirm_password: inputFields.confirm_password,
      firstname: inputFields.firstname,
      lastname: inputFields.lastname,
      email: inputFields.email,
    };
    axios
      .post(url, user)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        toast({ html: res.data.message });
        this.setState({
          isAuth: false,
        });
        this.props.history.replace("/login");
      })
      .catch((error) => {
        console.error("Signup Error: ", error);
        this.setState({
          isAuth: false,
          errMessage: error,
        });
      });
  };

  logoutHandler = () => {
    this.setState({
      isAuth: false,
      token: null,
      isAdmin: false,
      sessionId: null,
    });
    toast({ html: "You have logged out successfully" });
    localStorage.clear();
    this.props.history.push("/");
  };

  getApprovedProjectsHandler = () => {
    const url = "http://localhost:5000/projects";
    axios
      .get(url)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        this.setState({
          projects: res.data,
        });
      })
      .catch((err) => {
        console.log("All Projects Error:  " + err);
      });
  };

  viewProjectHandler = (projId) => {
    const project = this.state.projects.find((proj) => proj._id === projId);
    localStorage.setItem("current_project", JSON.stringify(project));
    this.setState({ project: project });
  };

  enrolForProjectHandler = (event, projId) => {
    event.preventDefault();
    const url = "http://localhost:5000/enlist";
    const token = localStorage.getItem("token");
    const user_projects = JSON.parse(localStorage.getItem("user_projects"));
    axios
      .post(
        url,
        { projId: projId },
        { headers: { Authorization: `bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        toast({ html: res.data.message });
        if (user_projects) {
          user_projects.push(res.data.enlisted_project);
          this.setState({ user_projects: user_projects });
          localStorage.setItem("user_projects", JSON.stringify(user_projects));
        }
      })
      .catch((err) => {
        console.log("Enlist Error:  " + err);
      });
  };

  approveProjectHandler = (event, projId) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    let url = "http://localhost:5000/approveproject";

    axios
      .post(
        url,
        { projId: projId },
        { headers: { Authorization: `bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          return;
        }
        toast({ html: res.data.message });
      })
      .catch((error) => {
        console.log("approve project error: " + error);
      });
  };

  updateProjectHandler = (event, updateData) => {
    event.preventDefault();
    let url = "http://localhost:5000/updateproject/" + updateData._id;
    let formData = new FormData();
    for (let key in updateData) {
      formData.append(key, updateData[key]);
    }
    const token = localStorage.getItem("token");
    axios
      .put(url, formData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          return;
        }

        const current_project = localStorage.setItem(
          "current_project",
          JSON.stringify(res.data.updatedProject)
        );
        this.setState({ project: current_project });
        toast({ html: res.data.message });
      })
      .catch((error) => {
        console.log("update project error: " + error);
      });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  render() {
    return (
      <div className='main__container'>
        <MainNav
          isAuth={this.state.isAuth}
          logoutHandler={this.logoutHandler}
        />
        <main className='main__content'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route
              exact
              path='/project/:id'
              render={(props) => (
                <ProjectDetail
                  {...props}
                  isAdmin={this.state.isAdmin}
                  project={this.state.project}
                  enrolForProject={this.enrolForProjectHandler}
                  approveProject={
                    this.state.isAdmin ? this.approveProjectHandler : null
                  }
                  updateProject={
                    this.state.isAdmin ? this.updateProjectHandler : null
                  }
                />
              )}
            />
            <Route
              exact
              path='/projects'
              render={(props) => (
                <ProjectList
                  {...props}
                  projects={this.state.projects}
                  viewProject={this.viewProjectHandler}
                />
              )}
            />

            <Route
              exact
              path='/login'
              render={(props) => (
                <Login {...props} loginHandler={this.loginHandler} />
              )}
            />
            <Route
              exact
              path='/signup'
              render={(props) => (
                <Signup {...props} signupHandler={this.signupHandler} />
              )}
            />
            <Route
              exact
              path='/dashboard'
              render={(props) => (
                <Dashboard
                  {...props}
                  isAuth={this.state.isAuth}
                  isAdmin={this.state.isAdmin}
                  sessionId={this.state.sessionId}
                />
              )}
            />
            <Route exact path='/about' component={About} />
            <Route exact path='/contact-us' component={Contact} />
            <Route
              exact
              path='/admin'
              render={(props) => (
                <Admin
                  {...props}
                  viewProject={this.viewProjectHandler}
                  isAuth={this.state.isAuth}
                  isAdmin={this.state.isAdmin}
                />
              )}
            />
            <Route component={PageNotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
