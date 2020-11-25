import React from "react";
import Button from "./../Button/Button";
import "./SingleProject.css";

const Project = (props) => {
  //   const { project } = props;
  const project = {};
  return (
    <div className='view__project'>
      <div className='project__image'>
        <img
          src={project.image_url}
          alt={"cyob" + project._id + " project photo"}
          form='project-form'
        />
        <div className='view__block'>
          <label>
            Project ID: cyob
            <span form='project-form' id='view__id' name='id'>
              {project._id}
            </span>
          </label>
          <div className='project__details'>
            <label form='project-form'> Brief:</label>
            {project.details}
          </div>
        </div>
      </div>
      <div id='project'>
        <form
          method='POST'
          action='/enlist'
          name='project-form'
          id='project-form'>
          <div className='view__block'>
            <label htmlFor='type'>Type: </label>
            <div>
              <input
                className='view__type'
                type='text'
                name='type'
                id='type'
                value={project.type}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='title'>Title: </label>
            <div>
              <input
                className='view__title'
                type='text'
                name='title'
                value={project.title}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='details'>Details: </label>
            <div>
              <input
                className='view__details'
                type='text'
                name='details'
                value={project.details}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='duration'>Estimated Duration: </label>
            <div>
              <input
                className='view__duration'
                type='text'
                name='duration'
                value={project.estimated_duration}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='address'>Address: </label>
            <div>
              <input
                className='view__address'
                type='text'
                name='address'
                value={project.address}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='city'>City: </label>
            <div>
              <input
                className='view__city'
                type='text'
                name='city'
                value={project.city}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='status'>Status: </label>
            <div>
              <input
                className='view__status'
                type='text'
                name='status'
                value={project.status}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='tools'>Tools Required: </label>
            <div>
              <input
                className='view__tools'
                type='text'
                name='tools'
                value={project.tools}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='current_workers'>Current No of Workers: </label>
            <div>
              <input
                className='view__current_workers'
                type='text'
                name='current_workers'
                value={project.current_workers}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='no_of_workers'>Maximum Workers: </label>
            <div>
              <input
                className='view__no_of_workers'
                type='text'
                name='no_of_workers'
                value={project.max_workers}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='worth'>Total Reward Points: </label>
            <div>
              <input
                className='view__worth'
                type='text'
                name='worth'
                value={project.reward_points}
                disabled
              />
            </div>
          </div>
          <div className='view__block'>
            <label htmlFor='posted_by'>Posted By: </label>
            <div>
              <input
                className='view__posted_by'
                type='text'
                name='posted_by'
                value={project.posted_by}
                disabled
              />
            </div>
          </div>
          <div className='form-button'>
            <Button
              form='project-form'
              id='interest'
              type='submit'
              text='ENLIST'
            />
            <a className='cancel-btn' href='/projects'>
              Back
            </a>
          </div>
          <hr />
          <div id='editProject'>
            <Button
              form='project-form'
              id='editproject-btn'
              type='button'
              text='EDIT'
            />
            <Button
              form='project-form'
              id='addproject-btn'
              type='button'
              text='ADD TO LIST'
            />
            <Button
              form='project-form'
              id='updateproject-btn'
              type='submit'
              text='UPDATE PROJECT'
              //   disabled={true}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Project;
