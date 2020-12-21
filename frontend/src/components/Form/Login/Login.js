import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
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
    const { loginHandler } = this.props;
    return (
      <Fragment>
        <div className='login__form'>
          <section className='login__body'>
            <div className='login__header'>
              <h4>Login</h4>
            </div>
            <hr />
            <form id='loginform' onSubmit={(e) => loginHandler(e, this.state)}>
              <div>
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
              <div>
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
                    <Link to='/signup' className='green-text'>
                      Sign up here!
                    </Link>
                  </span>
                </p>
              </div>
            </form>
          </section>
        </div>
      </Fragment>
    );
  }
}

export default Login;
