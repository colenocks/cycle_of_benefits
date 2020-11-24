import React from "react";
import Button from "./../../Button/Button";
import "./Login.css";

const Login = () => {
  return (
    <div className='login__form'>
      <section className='login__body'>
        <div className='login__header'>
          <h4>Enter your login credentials</h4>
        </div>
        <hr />
        <form id='loginform' name='loginform' method='post' action='/login'>
          <div className='input__block'>
            <label htmlFor='username'>Username</label>
            <input id='username' type='text' name='username' />
          </div>
          <div className='input__block'>
            <label htmlFor='password'>Password</label>
            <input id='password' type='password' name='password' />
          </div>
          <div className='form__button'>
            <Button text='LOGIN' />
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
  );
};

export default Login;
