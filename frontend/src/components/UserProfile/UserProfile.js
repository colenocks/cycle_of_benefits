import React from "react";
import Button from "./../Button/Button";
import "./UserProfile.css";

const UserProfile = (props) => {
  //   const { project } = props;
  const project = {};
  return (
    <div className='profile'>
      <div className='profile__heading'>
        <h3>My Profile</h3>
        <Button id='edit-button' icon={<i className='fas fa-edit fa-2x'></i>} />
      </div>
      <form
        method='put'
        encType='multipart/form-data'
        action='/updateuser'
        id='profile-form'>
        <div className='input__block'>
          <label htmlFor='username'>Username: </label>
          <div>
            <input
              id='edit_username'
              type='text'
              name='username'
              defaultValue={project.username + "Coleman"}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='first_name'>First Name : </label>
          <div>
            <input
              id='edit_firstname'
              type='text'
              name='first_name'
              defaultValue={project.firstname}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='last_name'>Last Name: </label>
          <div>
            <input
              id='edit_lastname'
              type='text'
              name='last_name'
              defaultValue={project.lastname}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='email'>Email: </label>
          <div>
            <input
              id='edit_email'
              type='email'
              name='email'
              defaultValue={project.email}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='dob'>DOB: </label>
          <div>
            <input
              id='edit_dob'
              type='date'
              name='dob'
              defaultValue={project.dob}
              max='2000-01-01'
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='address'>Address: </label>
          <div>
            <input
              id='edit_address'
              type='text'
              name='address'
              defaultValue={project.address}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='phone'>Phone Number: </label>
          <div>
            <input
              id='edit_phone'
              type='text'
              name='phone'
              defaultValue={project.phone}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='state'>State of Origin: </label>
          <div>
            <input
              id='edit_state'
              type='text'
              name='state'
              defaultValue={project.state}
              readOnly
            />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='national_id'>National ID Number: </label>
          <div>
            <input
              id='edit_national_id'
              type='text'
              name='national_id'
              defaultValue={project.nationalId}
              readOnly
            />
          </div>
        </div>
        <div className='form__button'>
          <Button
            id='save_changes'
            type='submit'
            text='SAVE CHANGES'
            disabled={true}
          />
          <a id='reset_button' className='cancel-btn' type='button' href='#!'>
            Reset
          </a>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default UserProfile;
