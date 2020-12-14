import React from "react";
import Button from "./../Button/Button";
import "./Project.css";

const Project = (props) => {
  const {
    index,
    project,
    btnLink,
    btnText,
    btnStyle,
    btnOnClick,
    noTitle,
    noStatus,
    noWorth,
    noWorkers,
    noPostedBy,
  } = props;
  return (
    <div
      className={project.status === "Completed" ? "project_ grey" : "project_"}>
      <div className='project__id'>{index + 1}</div>
      <div
        className={!noTitle ? "project__title" : "project__title no-display"}>
        {project.title}
      </div>
      <div
        className={
          !noStatus ? "project__status" : "project__status no-display"
        }>
        {project.status}
      </div>
      <div
        className={!noWorth ? "project__worth" : "project__worth no-display"}>
        {project.reward_points}
      </div>
      <div
        className={
          !noWorkers ? "project__workers" : "project__workers no-display"
        }>
        {project.current_workers + "/" + project.max_workers}
      </div>
      <div
        className={
          !noPostedBy ? "project__posted" : "project__posted no-display"
        }>
        {project.posted_by}
      </div>
      <div className='project__button'>
        <Button
          link={btnLink ? btnLink : null}
          text={btnText}
          onClick={() => btnOnClick(project._id)}
          style={btnStyle ? btnStyle : ""}
        />
      </div>
    </div>
  );
};

export default Project;
