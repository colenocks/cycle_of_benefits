import React from "react";
import "./ProjectHeading.css";

const ProjectHeading = (props) => {
  const { noTitle, noStatus, noWorth, noWorkers, noPostedBy } = props;
  return (
    <div className='project__heading teal-text'>
      <div className='heading__id'>
        <i className='fas fa-list-ol'></i>
      </div>
      <div
        className={!noTitle ? "heading__title" : "heading__title no-display"}>
        <h6>Title</h6>
      </div>
      <div
        className={
          !noStatus ? "heading__status" : "heading__status no-display"
        }>
        <h6>Status</h6>
      </div>
      <div
        className={!noWorth ? "heading__worth" : "heading__worth no-display"}>
        <h6>Worth</h6>
      </div>
      <div
        className={
          !noWorkers ? "heading__workers" : "heading__workers no-display"
        }>
        <h6>Workers</h6>
      </div>
      <div
        className={
          !noPostedBy ? "heading__posted" : "heading__posted no-display"
        }>
        <h6>Posted by</h6>
      </div>
      <div className='heading__button'></div>
    </div>
  );
};

export default ProjectHeading;
