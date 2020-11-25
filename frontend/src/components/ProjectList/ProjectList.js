import React from "react";
import Button from "../Button/Button";
import "./ProjectList.css";

const ProjectList = (props) => {
  return (
    <div className='project'>
      <div className='project__header'>
        <h4>Active Projects</h4>
        <h6>
          Current list of all approved Projects. Enroll for projects that
          interests you and earn rewards.
        </h6>
      </div>
      <div className='project__list'>
        <ul className='project__pills'>
          <li className='project__heading teal-text'>
            <div className='heading__id'>
              <i className='fas fa-list-ol'></i>
            </div>
            <div className='heading__title'>
              <i className='far fa-compass'></i>
              <h6>Title</h6>
            </div>
            <div className='heading__status'>
              <i className='fas fa-hourglass-half'></i>
              <h6>Status</h6>
            </div>
            <div className='heading__worth'>
              <i className='fa fa-hand-holding-usd'></i>
              <h6>Worth</h6>
            </div>
            <div className='heading__workers'>
              <i className='fa fa-clipboard-list'></i>
              <h6>Workers</h6>
            </div>
            <div className='heading__posted'>
              <i className='fa fa-user'></i>
              <h6>Posted by</h6>
            </div>
            <div className='heading__button'>
              <i className='fas fa-caret-square-right'></i>
            </div>
          </li>
          {/* {props.projects.map((project, index) => {
            return (
              <li key={project._id} className='project_'>
                <div className='project__id'>{index}</div>
                <div className='project__title'>{project.title}</div>
                <div
                  className={
                    project.status === "Completed"
                      ? "project__status grey-bg"
                      : "project__status"
                  }>
                  {project.status}
                </div>
                <div className='project__worth'>{project.reward_points}</div>
                <div className='project__workers'>
                  {project.current_workers + "/" + project.max_workers}
                </div>
                <div className='project__posted'>{project.posted_by}</div>
                <div className='project__button'>
                  <Button text='View' />
                </div>
              </li>
            );
          })} */}
        </ul>
      </div>
    </div>
  );
};

export default ProjectList;
