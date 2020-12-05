import React from "react";
import { CyobConsumer } from "../../contextAPI/context";
import Button from "./../Button/Button";
import "./SingleProject.css";

const Project = (props) => {
  return !props.location.state ? (
    <h4 className='no_project'>cannot find project</h4>
  ) : (
    <CyobConsumer>
      {(value) => {
        const { id } = props.location.state;
        const {
          project,
          fetchProjectHandler,
          enrolWorkerHandlerHandler,
        } = value;
        fetchProjectHandler(id);
        return project ? (
          <div className='view__project'>
            <div className='project__image'>
              <img
                src={project.image_url}
                alt={"cyob" + project._id + " project photo"}
                form='project-form'
              />
              <div className='project__title'>
                <label form='project-form'> Project Title: </label>{" "}
                <span>{project.title}</span>
              </div>
            </div>
            <div id='project'>
              <form
                name='project-form'
                id='project-form'
                onSubmit={(e) => enrolWorkerHandler(e, project._id)}>
                <div className='view__block'>
                  <label htmlFor='type'>Type: </label>
                  <input
                    className='view__type'
                    type='text'
                    name='type'
                    id='type'
                    defaultValue={project.type}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='title'>Title: </label>{" "}
                  <input
                    className='view__title'
                    type='text'
                    name='title'
                    defaultValue={project.title}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='details'>Details: </label>
                  <input
                    className='view__details'
                    type='text'
                    name='details'
                    defaultValue={project.details}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='duration'> Duration: </label>
                  <input
                    className='view__duration'
                    type='text'
                    name='duration'
                    defaultValue={project.estimated_duration}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='address'>Address: </label>
                  <input
                    className='view__address'
                    type='text'
                    name='address'
                    defaultValue={project.address}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='city'>City: </label>
                  <input
                    className='view__city'
                    type='text'
                    name='city'
                    defaultValue={project.city}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='status'>Status: </label>
                  <input
                    className='view__status'
                    type='text'
                    name='status'
                    defaultValue={project.status}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='tools'>Tools: </label>
                  <input
                    className='view__tools'
                    type='text'
                    name='tools'
                    defaultValue={project.tools}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='current_workers'>Current Workers: </label>
                  <input
                    className='view__current_workers'
                    type='text'
                    name='current_workers'
                    defaultValue={project.current_workers}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='no_of_workers'>Maximum Workers: </label>
                  <input
                    className='view__no_of_workers'
                    type='text'
                    name='no_of_workers'
                    defaultValue={project.max_workers}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='worth'>Total Points: </label>
                  <input
                    className='view__worth'
                    type='text'
                    name='worth'
                    defaultValue={project.reward_points}
                    disabled
                  />
                </div>
                <div className='view__block'>
                  <label htmlFor='posted_by'>Posted By: </label>
                  <input
                    className='view__posted_by'
                    type='text'
                    name='posted_by'
                    defaultValue={project.posted_by}
                    disabled
                  />
                </div>
                <div className='form-button'>
                  <Button id='interest' text='ENROL' />
                  <a className='cancel-btn' href='/projects'>
                    Back
                  </a>
                </div>
                <hr />
                <div id='editProject'>
                  <Button id='editproject-btn' text='EDIT' />
                  <Button id='addproject-btn' text='ADD TO LIST' />
                  <Button
                    id='updateproject-btn'
                    text='UPDATE PROJECT'
                    //   disabled={true}
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <h2 className='no_project'>cannot find project</h2>
        );
      }}
    </CyobConsumer>
  );
};

export default Project;
