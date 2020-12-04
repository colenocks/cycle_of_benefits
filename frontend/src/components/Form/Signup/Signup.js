import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { CyobConsumer } from "../../../contextAPI/context";
import Button from "./../../Button/Button";
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      confirm_password: "",
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
          const { hasSignedUp, handleSignUpUser, redirect_path } = value;

          return hasSignedUp ? (
            // Display dialog box to sign
            <Redirect to={redirect_path} />
          ) : (
            <div className='signup__form'>
              <form
                id='form'
                name='signupform'
                onSubmit={(e) => handleSignUpUser(e, this.state)}>
                <div className='signup__header'>
                  <h4>
                    Register{" "}
                    <span className='green-text'>Cycle of benefits</span>
                  </h4>
                </div>
                <hr />
                <div className='input__block'>
                  <label htmlFor='first_name'>First Name</label>

                  <input
                    id='firstname'
                    type='text'
                    name='firstname'
                    value={this.state.firstname}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className='input__block'>
                  <label htmlFor='last_name'>Last Name</label>

                  <input
                    id='lastname'
                    type='text'
                    name='lastname'
                    value={this.state.lastname}
                    onChange={this.handleChange}
                  />
                </div>
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
                  <label htmlFor='email'>Email</label>

                  <input
                    id='email'
                    type='email'
                    name='email'
                    value={this.state.email}
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
                <div className='input__block'>
                  <label htmlFor='confirm_password'>Confirm Password</label>
                  <input
                    id='confirm_password'
                    type='password'
                    name='confirm_password'
                    value={this.state.confirm_password}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className='form__button'>
                  <Button text='SIGN UP' type='submit' />
                  <a className='cancel-btn' href='/'>
                    Cancel
                  </a>
                </div>
                <hr />
                <div className='form__info'>
                  <p>
                    Got an Account Already?
                    <span>
                      <a className='green-text' href='/login'>
                        {" "}
                        Login Here!
                      </a>
                    </span>
                  </p>
                </div>
              </form>
            </div>
          );
        }}
      </CyobConsumer>
    );
  }
}

export default Signup;
