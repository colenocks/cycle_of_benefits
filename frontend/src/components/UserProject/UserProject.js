import React from "react";
import "./UserProject.css";

const UserProject = () => {
  return (
    <div className='user__project'>
      <h4>My Enlisted Projects</h4>
      <hr />
      <ul className='user_project__pills'>
        <li className='user_project__heading'>
          <div className='user_project__heading__id'>
            <h6>ID</h6>
          </div>
          <div className='user_project__heading__title'>
            <h6>Title</h6>
          </div>
          <div className='user_project__heading__status'>
            <h6>Status</h6>
          </div>
          <div className='user_project__heading__worth'>
            <h6>Worth</h6>
          </div>
          <div className='user_project__heading__button'>
            <i className='fas fa-caret-square-right'></i>
          </div>
        </li>
        {/* {props.userprojects.map((project, index) => {
            return (
              <li key={project._id} className='user_project_'>
                <div className='user_project__id'>{index}</div>
                <div className='user_project__title'>{project.title}</div>
                <div
                  className="user_project__status"
                  >
                  {project.status}
                </div>
                <div className='user_project__worth'>{project.reward_points}</div>
                <div className='user_project__button'>
                  <Button text='Withdraw' />
                </div>
              </li>
            );
          })} */}
      </ul>
    </div>
  );
};

export default UserProject;
