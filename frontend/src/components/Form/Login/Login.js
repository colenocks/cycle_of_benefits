import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { CyobConsumer } from "../../../contextAPI/context";
import Button from "./../../Button/Button";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <CyobConsumer>
        {(value) => {
          const { isLoggedIn, handleLoginUser, redirect_path } = value;

          return isLoggedIn ? (
            <Redirect to={redirect_path} />
          ) : (
            <Fragment>
              <div className='login__form'>
                <section className='login__body'>
                  <div className='login__header'>
                    <h4>Enter your login credentials</h4>
                  </div>
                  <hr />
                  <form
                    id='loginform'
                    onSubmit={(e) => handleLoginUser(e, this.state)}>
                    <div className='input__block'>
                      <label htmlFor='username'>Username</label>
                      <input
                        id='username'
                        type='text'
                        name='username'
                        value={this.state.username}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className='input__block'>
                      <label htmlFor='password'>Password</label>
                      <input
                        id='password'
                        type='password'
                        name='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className='form__button'>
                      <Button text='LOGIN' type='submit' />
                    </div>
                    <hr />
                    <div className='form__info'>
                      <p>
                        Don't Have an Account?{" "}
                        <span>
                          <a href='./signup' className='green-text'>
                            Sign up here!
                          </a>
                        </span>
                      </p>
                    </div>
                  </form>
                </section>
              </div>
            </Fragment>
          );
        }}
      </CyobConsumer>
    );
  }
}

export default Login;
