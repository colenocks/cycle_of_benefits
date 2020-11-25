import React from "react";

const UserProject = () => {
  return (
    <div>
      <h1>My Enlisted Projects</h1>
      <hr />
      <ul className='myprojects'>
        <li className='myproject-heading'>
          <div className='myproject-heading-id'>ID</div>
          <div className='myproject-heading-title'>Title</div>
          <div className='myproject-heading-status'>Status</div>
          <div className='myproject-heading-button'>
            <i className='fas fa-caret-square-right'></i>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UserProject;
