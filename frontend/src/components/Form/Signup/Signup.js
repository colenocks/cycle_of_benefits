import React, { Component } from "react";
import Button from "./../../Button/Button";
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupData: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ name, value }) {
    this.setState((prevState) => {
      let signupData = { ...prevState.signupData };
      signupData[name] = value;
      return { signupData };
    });
  }

  render() {
    const { signupHandler } = this.props;

    return (
      <div className='signup__form'>
        <form
          id='form'
          name='signupform'
          onSubmit={(e) => signupHandler(e, this.state.signupData)}>
          <div className='signup__header'>
            <h4>
              Register with{" "}
              <span className='green-text'>Cycle of benefits</span>
            </h4>
          </div>
          <hr />
          <div className='input__block'>
            <label htmlFor='firstname'>First Name</label>
            <input
              id='firstname'
              type='text'
              name='firstname'
              value={this.state.firstname}
              onChange={(e) => this.handleChange(e.target)}
              required
            />
          </div>
          <div className='input__block'>
            <label htmlFor='lastname'>Last Name</label>
            <input
              id='lastname'
              type='text'
              name='lastname'
              value={this.state.lastname}
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              type='text'
              name='username'
              value={this.state.username}
              onChange={(e) => this.handleChange(e.target)}
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
              onChange={(e) => this.handleChange(e.target)}
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
              onChange={(e) => this.handleChange(e.target)}
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
              onChange={(e) => this.handleChange(e.target)}
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
  }
}

export default Signup;
