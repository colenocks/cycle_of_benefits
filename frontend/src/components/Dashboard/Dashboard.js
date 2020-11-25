import React from "react";
import Reward from "../Reward/Reward";
import HowToInfo from "../HowToInfo/HowToInfo";
import UserProject from "../UserProject/UserProject";
import PostProject from "../PostProject/PostProject";
import UserProfile from "./../UserProfile/UserProfile";
import "./Dashboard.css";

const Profile = () => {
  return (
    <div className='boxes'>
      <div className='leftbox'>
        <div>
          <a id='profile' className='active'>
            <i className='fa fa-user'></i>
            <span className='nav-menu'>My Profile</span>
          </a>
          <a id='messages'>
            <i className='fas fa-caret-square-down'></i>
            <span className='nav-menu'>Projects enlisted</span>
          </a>
          <a id='rewards'>
            <i className='fa fa-hand-holding-usd'></i>
            <span className='nav-menu'>My Rewards</span>
          </a>
          <a id='postproject'>
            <i className='fas fa-lightbulb'></i>
            <span className='nav-menu'>Propose Project</span>
          </a>
          <a id='information'>
            <i className='fas fa-info-circle'></i>
            <span className='nav-menu'>Information</span>
          </a>
        </div>
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
};

export default Profile;
