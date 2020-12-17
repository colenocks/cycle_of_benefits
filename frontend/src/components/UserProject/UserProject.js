import React from "react";
import ProjectHeading from "./../Project/ProjectHeading";
import Project from "../Project/Project";
import "./UserProject.css";

const UserProject = (props) => {
  const { projects, withDrawFromProject } = props;

  return !projects ? (
    <h5 className='center'>Reload Page!</h5>
  ) : (
    <div className='user__project'>
      <h3 className='center'>Enlisted Projects</h3>
      <ProjectHeading noWorkers={true} noPostedBy={true} />
      {projects.length === 0 ? (
        <h5 className='center'>You have no enlisted projects!</h5>
      ) : (
        projects.map((project, index) => {
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
        })
      )}
    </div>
  );
};

export default UserProject;
