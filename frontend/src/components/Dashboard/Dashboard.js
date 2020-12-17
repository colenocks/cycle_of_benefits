import React, { Component } from "react";
import { Link } from "react-router-dom";
import Admin from "../Admin/Admin";
import Reward from "../Reward/Reward";
import HowToInfo from "../HowToInfo/HowToInfo";
import UserProject from "../UserProject/UserProject";
import PostProject from "../PostProject/PostProject";
import UserProfile from "./../UserProfile/UserProfile";
import axios from "axios";
import "./Dashboard.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      projects: [],
      sessionId: null,
      isAuth: false,
    };
  }

  componentDidMount() {
    this.getUserProfileHandler();
    this.getUserProjectsHandler();
    const sessionId = localStorage.getItem("sessionId");
    const role = localStorage.getItem("role");
    const current_user = JSON.parse(localStorage.getItem("current_user"));
    const user_projects = JSON.parse(localStorage.getItem("user_projects"));
    if (sessionId || role || current_user || user_projects) {
      this.setState({
        sessionId: sessionId,
        isAdmin: role ? true : false,
        profile: current_user,
        projects: user_projects,
      });
    }
  }

  getUserProfileHandler = () => {
    const user = this.props.sessionId;
    if (user) {
      const url = "http://localhost:5000/profile/" + user;
      axios
        .get(url)
        .then((res) => {
          if (res.data.errMessage) {
            return;
          }
          this.setState({ profile: res.data });
          localStorage.setItem("current_user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log("Get UserProfile Error:  ", err);
        });
    }
  };

  getUserProjectsHandler = () => {
    const userId = this.props.sessionId;
    if (userId) {
      const url = "http://localhost:5000/myprojects/" + userId;
      axios
        .get(url)
        .then((res) => {
          if (res.data.errMessage) {
            console.log(res.data.errMessage);
            return;
          }
          this.setState({ projects: res.data });
          localStorage.setItem("user_projects", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log("Get UserProjects Error:  ", err);
        });
    }
  };

  updateUserProfileHandler = (userProfile) => {
    const url = "http://localhost:5000/profile";
    axios
      .put(url, userProfile)
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
      })
      .catch((err) => {
        console.log("Update UserProfile Error:  ", err);
      });
  };

  proposeProjectHandler = (project) => {
    const url = "http://localhost:5000/addproject";
    axios
      .post(url, project)
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
      })
      .catch((err) => {
        console.log("Add Project Error:  ", err);
      });
  };

  withdrawFromProjectHandler = (projId) => {
    const url = "http://localhost:5000/dropworker/" + projId;
    const token = localStorage.getItem("token");
    axios
      .delete(url, { headers: { Authorization: `bearer ${token}` } })
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
        console.log(res.data);

        this.updateLocalStorageUserProjects(res.data.withdrawn_project);
      })
      .catch((err) => {
        console.log("withdraw Worker Error:  " + err);
      });
  };

  updateLocalStorageUserProjects = (removedProject) => {
    const projects = JSON.parse(localStorage.getItem("user_projects"));
    if (projects) {
      const updatedProjects = projects.filter(
        (proj) => proj.projectId !== removedProject._id
      );
      localStorage.setItem("user_projects", JSON.stringify(updatedProjects));
      this.setState({ projects: updatedProjects });
    }
  };

  dashboardNavigator = (e) => {
    const tabs = Array.from(document.querySelectorAll(".navlink"));
    let tabSections = Array.from(
      document.querySelector(".tab_section").children
    );
    const id = e.currentTarget.id;
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabSections.forEach((section) => section.classList.add("noshow"));
    e.currentTarget.classList.add("active");
    this[id].classList.remove("noshow");
  };

  render() {
    if (this.props.isAuth) {
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
              <UserProfile
                profile={this.state.profile}
                updateProfile={this.updateUserProfileHandler}
              />
            </div>
            <div
              ref={(elem) => (this.postproject = elem)}
              className='postproject noshow'>
              <PostProject proposeProject={this.proposeProjectHandler} />
            </div>
            <div
              ref={(elem) => (this.rewards = elem)}
              className='rewards noshow'>
              <Reward profile={this.state.profile} />
            </div>
            <div
              ref={(elem) => (this.userproject = elem)}
              className='userproject noshow'>
              <UserProject
                projects={this.state.projects}
                withDrawFromProject={this.withdrawFromProjectHandler}
              />
            </div>
            <div
              ref={(elem) => (this.information = elem)}
              className='information noshow'>
              <HowToInfo />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='container'>
          <h4>You are not logged in</h4>
          <Link to='/'>Go to home page</Link>
        </div>
      );
    }
  }
}

export default Profile;
