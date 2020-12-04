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
      sessionId: null,
      isLoggedIn: false,
      hasSignedUp: false,
      redirect_path: null,
      errMessage: null,
      projects: [],
      project: {},
    };

    this.handleLoginUser = this.handleLoginUser.bind(this);
    this.handleSignUpUser = this.handleSignUpUser.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
  }

  handleLoginUser(event, inputFields) {
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
        } else {
          toast({ html: "Login Successful" });
          this.setState({
            isLoggedIn: true,
            redirect_path: res.data.redirect_path,
          });
        }
      })
      .catch((error) => {
        console.error("Login Error: ", error);
        this.setState({
          isLoggedIn: false,
          errMessage: null,
        });
      });
  }

  handleSignUpUser(event, inputFields) {
    event.preventDefault();
    const url = "http://localhost:5000/login";
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
          errMessage: null,
        });
      });
  }

  getAllProjects() {
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

  getProject(id) {
    const url = "http://localhost:5000/project/" + id;
    axios
      .get(url)
      .then((res) => {
        if (res.data.errMessage) {
          toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        this.setState({
          project: res.data,
        });
      })
      .catch((err) => {
        console.log("All Projects Error:  " + err);
      });
  }

  componentDidMount() {
    this.getAllProjects();
  }

  render() {
    return (
      <CyobContext.Provider
        value={{
          ...this.state,
          handleLoginUser: this.handleLoginUser,
          handleSignUpUser: this.handleSignUpUser,
          getProject: this.getProject,
        }}>
        {this.props.children}
      </CyobContext.Provider>
    );
  }
}

const CyobConsumer = CyobContext.Consumer;

export { CyobProvider, CyobConsumer };
