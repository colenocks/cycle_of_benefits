import React, { Component } from "react";
import Button from "./../Button/Button";
import "./UserProfile.css";

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {},
      disabled: true,
      readOnly: true,
    };
  }

  handleChange = ({ name, value }) => {
    this.setState((prevState) => {
      let profile = { ...prevState.profile };
      profile[name] = value;
      return { profile };
    });
  };

  resetChangesHandler = () => {
    const previousProfileData = { ...this.props.profile };
    this.setState({
      profile: previousProfileData,
    });
  };

  toggleEditProfileHandler = () => {
    let { disabled, readOnly } = this.state;
    if (disabled) {
      disabled = false;
      readOnly = false;
    } else {
      disabled = true;
      readOnly = true;
    }
    this.setState({ disabled, readOnly });
  };

  render() {
    const { updateProfile, profile } = this.props;
    const { readOnly } = this.state;

    return !profile ? (
      <div>Refresh page</div>
    ) : (
      <div className='profile'>
        <div className='profile__heading'>
          <h3>My Profile</h3>
          <Button
            id='edit-button'
            icon={<i className='fas fa-edit fa-2x'></i>}
            onClick={this.toggleEditProfileHandler}
          />
        </div>
        <form
          encType='multipart/form-data'
          id='profile-form'
          onSubmit={(e) => updateProfile(e, this.state.profile)}>
          <div className='input__block'>
            <label htmlFor='username'>Username: </label>
            <input
              id='edit_username'
              type='text'
              name='username'
              defaultValue={profile.username}
              disabled
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='firstname'>First Name: </label>
            <input
              id='edit_firstname'
              type='text'
              name='firstname'
              defaultValue={profile.firstname}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='lastname'>Last Name: </label>
            <input
              id='edit_lastname'
              type='text'
              name='lastname'
              defaultValue={profile.lastname}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='email'>Email: </label>
            <input
              id='edit_email'
              type='email'
              name='email'
              defaultValue={profile.email}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='dob'>DOB: </label>
            <input
              id='edit_dob'
              type={readOnly ? "text" : "date"}
              name='dob'
              defaultValue={profile.dob}
              onChange={(e) => this.handleChange(e.target)}
              max='2000-01-01'
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='address'>Address: </label>
            <input
              id='edit_address'
              type='text'
              name='address'
              defaultValue={profile.address}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='phone'>Phone Number: </label>
            <input
              id='edit_phone'
              type='text'
              name='phone'
              defaultValue={profile.phone}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='state'>State of Origin: </label>
            <input
              id='edit_state'
              type='text'
              name='state'
              defaultValue={profile.state}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='national_id'>National ID Number: </label>
            <input
              id='edit_national_id'
              type='text'
              name='national_id'
              defaultValue={profile.nationalId}
              onChange={(e) => this.handleChange(e.target)}
              readOnly={readOnly}
            />
          </div>
          <div className='form__button'>
            <Button
              type='submit'
              id='save_changes'
              text='SAVE CHANGES'
              disabled={this.state.disabled}
            />
            <a
              onClick={this.resetChangesHandler}
              id='reset_button'
              className='cancel-btn'
              href='#!'>
              Reset
            </a>
          </div>
          <hr />
        </form>
      </div>
    );
  }
}

export default UserProfile;
