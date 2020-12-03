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
    };

    this.handleLoginUser = this.handleLoginUser.bind(this);
    this.handleSignUpUser = this.handleSignUpUser.bind(this);
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
      .catch((error) => console.error("Login Error: ", error));
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
        } else {
          toast({ html: res.data.message });
          this.setState({
            hasSignedUp: true,
            message: res.data.message,
          });
        }
      })
      .catch((error) => console.error("Signup Error: ", error));
  }

  render() {
    return (
      <CyobContext.Provider
        value={{
          ...this.state,
          handleLoginUser: this.handleLoginUser,
          handleSignUpUser: this.handleSignUpUser,
        }}>
        {this.props.children}
      </CyobContext.Provider>
    );
  }
}

const CyobConsumer = CyobContext.Consumer;

export { CyobProvider, CyobConsumer };
