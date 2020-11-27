import React, { Component } from "react";
import Reward from "../Reward/Reward";
import HowToInfo from "../HowToInfo/HowToInfo";
import UserProject from "../UserProject/UserProject";
import PostProject from "../PostProject/PostProject";
import UserProfile from "./../UserProfile/UserProfile";
import "./Dashboard.css";

class Profile extends Component {
  state = {};

  render() {
    return (
      <div className='boxes'>
        <div className='leftbox'>
          <ul>
            <li id='profile' className='active'>
              <i className='fa fa-user'></i>
              <span className='nav__menu'>My Profile</span>
            </li>
            <li id='messages'>
              <i className='fas fa-caret-square-down'></i>
              <span className='nav__menu'>Projects enlisted</span>
            </li>
            <li id='rewards'>
              <i className='fa fa-hand-holding-usd'></i>
              <span className='nav__menu'>My Rewards</span>
            </li>
            <li id='postproject'>
              <i className='fas fa-lightbulb'></i>
              <span className='nav__menu'>Propose Project</span>
            </li>
            <li id='information'>
              <i className='fas fa-info-circle'></i>
              <span className='nav__menu'>Information</span>
            </li>
          </ul>
        </div>
        <div className='rightbox'>
          <div className='profile'>
            <UserProfile />
          </div>
          <div className='postproject noshow'>
            <PostProject />
          </div>
          <div className='rewards noshow'>
            <Reward />
          </div>
          <div className='messages noshow'>
            <UserProject />
          </div>
          <div className='information noshow'>
            <HowToInfo />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
