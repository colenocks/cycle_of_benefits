import React from "react";
import Button from "./../Button/Button";
import "./PostProject.css";

const PostProject = () => {
  return (
    <div className='post__project'>
      <h3>Post a new Project</h3>
      <form
        method='post'
        encType='multipart/form-data'
        action='/addproject'
        id='post_project'>
        <div className='input__block'>
          <label htmlFor='type'>Project Type: </label>
          <select id='proj_type' name='type'>
            <option value='Refuse Dump Site'>Refuse Dump Site</option>
            <option value='Clogged Gutter'>Clogged Gutter</option>
            <option value='Market Cleaning'>Market Cleaning</option>
            <option value='Grass Cutting'>Grass Cutting</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='input__block'>
          <label htmlFor='title'>Title:</label>
          <div>
            <input id='proj_title' type='text' name='title' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='details'>Project Details:</label>
          <div>
            <textarea id='proj_details' rows='6' name='details'></textarea>
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='tools'>Required Tools:</label>
          <div>
            <input id='proj_tools' type='text' name='tools' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='image'>Upload Picture file:</label>
          <div>
            <input type='file' id='proj_image' name='image' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='address'>Address:</label>
          <div>
            <input id='proj_address' type='text' name='address' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='city'>City:</label>
          <div>
            <input id='proj_city' type='text' name='city' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='duration'>Estimated Duration of Project: </label>
          <div>
            <input id='proj_duration' type='text' name='duration' />
          </div>
        </div>
        <div className='input__block'>
          <label htmlFor='max_workers'>Number of Workers:</label>
          <div>
            <input
              id='proj_max_workers'
              type='number'
              name='max_workers'
              min='1'
            />
          </div>
        </div>
        <div className='form__button'>
          <Button type='submit' text='SUBMIT' />
          <a className='cancel-btn' href='/'>
            Back
          </a>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default PostProject;
