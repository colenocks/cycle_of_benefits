import React, { Component } from "react";
import Reward from "../Reward/Reward";
import HowToInfo from "../HowToInfo/HowToInfo";
import UserProject from "../UserProject/UserProject";
import PostProject from "../PostProject/PostProject";
import UserProfile from "./../UserProfile/UserProfile";
import "./Dashboard.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dashboardNavigator = this.dashboardNavigator.bind(this);
  }

  dashboardNavigator(e) {
    const tabs = Array.from(document.querySelectorAll(".navlink"));
    let tabSections = Array.from(
      document.querySelector(".tab_section").children
    );
    const id = e.currentTarget.id;
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabSections.forEach((section) => section.classList.add("noshow"));
    e.currentTarget.classList.add("active");
    this[id].classList.remove("noshow");
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='tab'>
          <ul>
            <li
              onClick={(e) => this.dashboardNavigator(e)}
              id='profile'
              className='navlink active'>
              <i className='fa fa-user'></i>
              <span className='nav__menu'>My Profile</span>
            </li>
            <li
              onClick={(e) => this.dashboardNavigator(e)}
              id='userproject'
              className='navlink'>
              <i className='fas fa-caret-square-down'></i>
              <span className='nav__menu'>Projects enlisted</span>
            </li>
            <li
              onClick={(e) => this.dashboardNavigator(e)}
              id='rewards'
              className='navlink'>
              <i className='fa fa-hand-holding-usd'></i>
              <span className='nav__menu'>My Rewards</span>
            </li>
            <li
              onClick={(e) => this.dashboardNavigator(e)}
              id='postproject'
              className='navlink'>
              <i className='fas fa-lightbulb'></i>
              <span className='nav__menu'>Propose Project</span>
            </li>
            <li
              onClick={(e) => this.dashboardNavigator(e)}
              id='information'
              className='navlink'>
              <i className='fas fa-info-circle'></i>
              <span className='nav__menu'>Information</span>
            </li>
          </ul>
        </div>
        <div className='tab_section'>
          <div ref={(elem) => (this.profile = elem)} className='profile'>
            <UserProfile />
          </div>
          <div
            ref={(elem) => (this.postproject = elem)}
            className='postproject noshow'>
            <PostProject />
          </div>
          <div ref={(elem) => (this.rewards = elem)} className='rewards noshow'>
            <Reward />
          </div>
          <div
            ref={(elem) => (this.userproject = elem)}
            className='userproject noshow'>
            <UserProject />
          </div>
          <div
            ref={(elem) => (this.information = elem)}
            className='information noshow'>
            <HowToInfo />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
