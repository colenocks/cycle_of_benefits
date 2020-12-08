import React from "react";
import "./ProjectHeading.css";

const ProjectHeading = () => {
  return (
    <div className='project__heading teal-text'>
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
    </div>
  );
};

export default ProjectHeading;
