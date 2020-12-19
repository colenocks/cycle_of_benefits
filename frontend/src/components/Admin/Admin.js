import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Project from "./../Project/Project";
import Button from "./../Button/Button";
import "./Admin.css";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      users: [],
      rewards: [],
    };
  }

  getAllProjectsHandler = () => {
    const url = "http://localhost:5000/getallprojects";
    const token = localStorage.getItem("token");
    axios
      .get(url, { headers: { Authorization: `bearer ${token}` } })
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          this.setState({ errMessage: res.data.errMessage });
          return;
        }
        this.setState({
          projects: res.data,
        });
      })
      .catch((err) => {
        console.log("All Projects Error:  " + err);
      });
  };

  archiveProjectHandler = () => {};
  deleteProjectHandler = () => {};
  getUsersHandler = () => {};
  deleteUserHandler = () => {};
  getRewardRequestsHandler = () => {};

  render() {
    const { projects } = this.state;
    const { isAdmin, viewProject } = this.props;
    return isAdmin ? (
      <div className='admin'>
        <header>
          <h3>Control Panel</h3>
          <h6>
            Enter the necessary input detail to view or make modifications
          </h6>
        </header>
        <hr />
        <div className='input__id'>
          <div>
            <input type='text' id='project_id' placeholder='Project ID' />
          </div>
          <div>
            <input type='text' id='user_id' placeholder='Username/userID' />
          </div>
        </div>
        <hr />
        <div className='input__control'>
          <Button
            id='viewUsers'
            text='View Users'
            onClick={this.getUsersHandler}
          />
          <Button
            id='viewProjects'
            text='View Projects'
            onClick={this.getAllProjectsHandler}
          />
          <Button
            id='archiveProject'
            text='Archive Projects'
            onClick={this.archiveProjectHandler}
          />
          <Button
            id='redeemedRewards'
            text='View Requests'
            onClick={this.getRewardRequestsHandler}
          />
          <Button
            id='deleteUser'
            text='Delete User'
            onClick={this.deleteUserHandler}
          />
          <Button
            id='deleteProject'
            text='Delete Project'
            onClick={this.deleteProjectHandler}
          />
        </div>
        <div className='admin__display'>
          <div className='display__header'>
            <h4>Users Proposed Projects</h4>
            <h6>Current list of all proposed projects from users.</h6>
          </div>
          <div className='display__body'>
            {projects ? (
              projects.map((project, index) => {
                return (
                  <Project
                    key={project._id}
                    index={index}
                    project={project}
                    btnLink={"/project/" + project._id}
                    btnText='view'
                    btnOnClick={viewProject}
                  />
                );
              })
            ) : (
              <h4>No projects to display</h4>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className='container'>
        <h4>You are not logged in</h4>
        <Link to='/'>Go to home page</Link>
      </div>
    );
  }
}

export default Admin;
