import React from "react";
import Button from "./../Button/Button";
import "./PostProject.css";

const PostProject = () => {
  return (
    <div className='post__project'>
      <h3 className='center'>Propose a Project</h3>
      <form
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
          <input id='proj_title' type='text' name='title' />
        </div>
        <div className='input__block'>
          <label htmlFor='details'>Details:</label>
          <textarea id='proj_details' rows='6' name='details'></textarea>
        </div>
        <div className='input__block'>
          <label htmlFor='tools'>Required Tools:</label>
          <input id='proj_tools' type='text' name='tools' />
        </div>
        <div className='input__block'>
          <label htmlFor='image'>Photos:</label>
          <input type='file' id='proj_image' name='image' />
        </div>
        <div className='input__block'>
          <label htmlFor='address'>Address:</label>
          <input id='proj_address' type='text' name='address' />
        </div>
        <div className='input__block'>
          <label htmlFor='city'>City:</label>
          <input id='proj_city' type='text' name='city' />
        </div>
        <div className='input__block'>
          <label htmlFor='duration'>Estimated Duration: </label>
          <input id='proj_duration' type='text' name='duration' />
        </div>
        <div className='input__block'>
          <label htmlFor='max_workers'>No. of Workers:</label>
          <input
            id='proj_max_workers'
            type='number'
            name='max_workers'
            min='1'
          />
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
