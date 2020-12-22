import React, { Component } from "react";
import axios from "axios";

//ENV VARIABLES
// const {  } = process.env;

const { toast } = window.M;

const CyobContext = React.createContext();

class CyobProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      token: null,
      sessionId: null,
      isLoggedIn: false,
      hasSignedUp: false,
      redirect_path: null,
      errMessage: null,
      projects: [],
      project: {},
    };

    this.loginHandler = this.loginHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.fetchAllProjectsHandler = this.fetchAllProjectsHandler.bind(this);
    this.fetchProjectHandler = this.fetchProjectHandler.bind(this);
    this.enrolWorkerHandler = this.enrolWorkerHandler.bind(this);
    this.dropWorkerHandler = this.dropWorkerHandler.bind(this);
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

  loginHandler(event, inputFields) {
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
          isLoggedIn: false,
          errMessage: error,
        });
      });
  }

  signupHandler(event, inputFields) {
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
          hasSignedUp: true,
        });
      })
      .catch((error) => {
        console.error("Signup Error: ", error);
        this.setState({
          hasSignedUp: false,
          errMessage: error,
        });
      });
  }

  logoutHandler() {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("sessionId");
  }

  fetchAllProjectsHandler() {
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
  }

  fetchProjectHandler(projId) {
    const url = "http://localhost:5000/project/" + projId;
    axios
      .get(url)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        this.setState({ project: res.data });
      })
      .catch((err) => {
        console.log("Get Error:  " + err);
      });
  }

  enrolWorkerHandler(event, projId) {
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
  }

  dropWorkerHandler(projId) {
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
  }

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  render() {
    return (
      <CyobContext.Provider
        value={{
          ...this.state,
          loginHandler: this.loginHandler,
          signupHandler: this.signupHandler,
          fetchProjectHandler: this.fetchProjectHandler,
          enrolWorkerHandler: this.enrolWorkerHandler,
          dropWorkerHandler: this.dropWorkerHandler,
        }}>
        {this.props.children}
      </CyobContext.Provider>
    );
  }
}

const CyobConsumer = CyobContext.Consumer;

export { CyobProvider, CyobConsumer };
