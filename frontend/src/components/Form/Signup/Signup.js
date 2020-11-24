import React from "react";
import Button from "./../../Button/Button";
import "./Signup.css";

const Signup = () => {
  return (
    <div className='signup__form'>
      <form id='form' name='signupform' action='/signup' method='post'>
        <div className='signup__header'>
          <h4>
            Register with <span className='green-text'>Cycle of benefits</span>
          </h4>
        </div>
        <hr />
        <div className='input__block'>
          <label htmlFor='first_name'>First Name</label>

          <input id='reg_firstname' type='text' name='first_name' />
        </div>
        <div className='input__block'>
          <label htmlFor='last_name'>Last Name</label>

          <input id='reg_lastname' type='text' name='last_name' />
        </div>
        <div className='input__block'>
          <label htmlFor='username'>Username</label>

          <input id='reg_username' type='text' name='username' />
        </div>
        <div className='input__block'>
          <label htmlFor='email'>Email</label>

          <input id='reg_email' type='email' name='email' />
        </div>
        <div className='input__block'>
          <label htmlFor='password'>Password</label>
          <input id='reg_password' type='password' name='password' />
        </div>
        <div className='input__block'>
          <label htmlFor='confirm_password'>Confirm Password</label>
          <input
            id='reg_conf_password'
            type='password'
            name='confirm_password'
          />
        </div>
        <div className='form__button'>
          <Button text='SIGN UP' />
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
};

export default Signup;
