import React from "react";
import { Link } from "react-router-dom";
import Button from "./../Button/Button";
import "./Project.css";

const Project = (props) => {
  const { project, index } = props;
  return (
    <div
      key={project._id}
      className={project.status === "Completed" ? "project_ grey" : "project_"}>
      <div className='project__id'>{index + 1}</div>
      <div className='project__title'>{project.title}</div>
      <div className='project__status'>{project.status}</div>
      <div className='project__worth'>{project.reward_points}</div>
      <div className='project__workers'>
        {project.current_workers + "/" + project.max_workers}
      </div>
      <div className='project__posted'>{project.posted_by}</div>
      <div className='project__button'>
        <Link
          to={{
            pathname: "/project/" + project._id,
          }}>
          <Button text='view' />
        </Link>
      </div>
    </div>
  );
};

export default Project;
