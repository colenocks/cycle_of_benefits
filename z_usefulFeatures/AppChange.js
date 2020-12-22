import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import Signup from "./components/Form/Signup/Signup";
import About from "./components/About/About";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";
import ProjectList from "./components/ProjectList/ProjectList";
import Contact from "./components/Contact/Contact";
import PageNotFound from "../frontend/src/components/PageNotFound/PageNotFound";
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
      redirect_path: null,
      errMessage: null,
      projects: [],
      project: {},
    };
  }

  componentDidMount() {
    this.fetchAllProjectsHandler();
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const sessionId = localStorage.getItem("sessionId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, sessionId: sessionId });
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
        this.setState({
          isAuth: true,
          token: res.data.token,
          userId: res.data.userId,
          redirect_path: res.data.redirect_path,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("sessionId", res.data.sessionId);
        const remainingMilliseconds = 60 * 30 * 1000; //30minutes
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
        toast({ html: "Login Successful" });
      })
      .catch((error) => {
        console.error("Login Error: ", error);
        this.setState({
          isAuth: false,
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
        // this.props.history.replace("/");
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
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("sessionId");
  };

  fetchAllProjectsHandler = () => {
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
    const projects = [...this.state.projects];
    const project = projects.find((proj) => proj._id === projId);
    this.setState({ project });
  };

  // approveProjectHandler = () => {};
  // updateProjectHandler = () => {};

  enrolWorkerHandler = (event, projId) => {
    event.preventDefault();
    const url = "http://localhost:5000/enlist";
    const body = { projId };
    axios
      .post(url, body)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        toast({ html: res.data.message });
      })
      .catch((err) => {
        console.log("Enlist Error:  " + err);
      });
  };

  dropWorkerHandler = (projId) => {
    const url = "http://localhost:5000/dropworker/" + projId;
    axios
      .delete(url)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        toast({ html: res.data.message });
      })
      .catch((err) => {
        console.log("DropWorker Error:  " + err);
      });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  render() {
    let dashboard = null;
    if (this.state.isAuth) {
      dashboard = (
        <Switch>
          <Route
            exact
            path='/dashboard'
            render={(props) => (
              <Dashboard {...props} sessionId={this.state.sessionId} />
            )}
          />
          <Redirect to='/' />
        </Switch>
      );
    }
    return (
      <div className='main__container'>
        <MainNav />
        <main className='main__content'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route
              exact
              path='/project/:id'
              render={(props) => (
                <ProjectDetail
                  {...props}
                  isAdmin={isAdmin}
                  project={this.state.project}
                  enrolWorker={this.enrolWorkerHandler}
                  // if isAdmin
                  approveProject={this.approveProjectHandler}
                  updateProject={this.updateProjectHandler}
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
                <Login
                  {...props}
                  loginUser={this.loginHandler}
                  redirect_path={redirect_path}
                />
              )}
            />
            <Route
              exact
              path='/signup'
              render={(props) => (
                <Signup {...props} signupUser={this.signupHandler} />
              )}
            />
            {dashboard}
            <Route exact path='/about' component={About} />
            <Route exact path='/contact-us' component={Contact} />
            <Route component={PageNotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);

/* 

import { Route, Switch } from "react-router-dom";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import Signup from "./components/Form/Signup/Signup";
import About from "./components/About/About";
import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Dashboard/Dashboard";
import SingleProject from "./components/ProjectDetail/ProjectDetail";
import ProjectList from "./components/ProjectList/ProjectList";
import Contact from "./components/Contact/Contact";
import "./App.css";

function App() {
  return (
    <div className='main__container'>
      <MainNav />
      <main className='main__content'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/project/:id'
            render={(props) => <SingleProject {...props} />}
          />
          <Route exact path='/projects' component={ProjectList} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/about' component={About} />
          <Route exact path='/contact-us' component={Contact} />
          <Route exact path='/admin' component={Admin} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;


*/
