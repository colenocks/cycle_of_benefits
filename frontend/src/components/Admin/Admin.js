import React from "react";
import Button from "./../Button/Button";
import "./Admin.css";

const Admin = () => {
  return (
    <div className='admin'>
      <header>
        <h3>Control Panel</h3>
        <h6>Enter the necessary input detail to view or make modifications</h6>
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
        <Button type='button' id='viewUsers' text='View Users'></Button>
        <Button type='button' id='viewProjects' text='View Projects'></Button>
        <Button
          type='button'
          id='archiveProject'
          text='Archive Projects'></Button>
        <Button
          type='button'
          id='redeemedRewards'
          text='View Requests'></Button>
        <Button type='button' id='deleteUser' text='Delete User'></Button>
        <Button type='button' id='deleteProject' text='Delete Project'></Button>
      </div>
      <div className='admin__display'>
        <div className='display__header'>
          <h4>Users Proposed Projects</h4>
          <h6>Current list of all proposed projects from users.</h6>
        </div>
        <div className='display__body'>
          <div className='project__list'>
            <ul className='project__pills'>
              <li className='project__heading teal-text'>
                <div className='heading__id'>
                  <i className='fas fa-list-ol'></i>
                </div>
                <div className='heading__title'>Title</div>
                <div className='heading__status'>
                  <i className='fas fa-hourglass-half'></i>
                </div>
                <div className='heading__worth'>
                  <i className='fa fa-hand-holding-usd'></i>
                </div>
                <div className='heading__workers'>
                  <i className='fa fa-clipboard-list'></i>
                </div>
                <div className='heading__posted'>
                  <i className='fa fa-user'></i>
                </div>
                <div className='heading__button'>
                  <i className='fas fa-caret-square-right'></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
