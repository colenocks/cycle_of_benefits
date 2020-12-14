import React from "react";
import ProjectHeading from "./../Project/ProjectHeading";
import Project from "../Project/Project";
import "./UserProject.css";

const UserProject = (props) => {
  const { projects, withDrawFromProject } = props;
  return (
    <div className='user__project'>
      <ProjectHeading noWorkers={true} noPostedBy={true} />
      {projects.map((project, index) => {
        return (
          <Project
            key={project._id}
            index={index}
            project={project}
            noWorkers={true}
            noPostedBy={true}
            btnText='leave'
            btnOnClick={withDrawFromProject}
            btnStyle='hover-red'
          />
        );
      })}
    </div>
  );
};

export default UserProject;

/* 
<div key={project._id} className='user_project_'>
            <div className='user_project__id'>{index}</div>
            <div className='user_project__title'>{project.title}</div>
            <div className='user_project__status'>{project.status}</div>
            <div className='user_project__worth'>{project.reward_points}</div>
            <div className='user_project__button'>
              <Button text='Withdraw' />
            </div>
          </div> */
