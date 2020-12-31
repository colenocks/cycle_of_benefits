import React, { Component } from "react";
import Button from "./../Button/Button";
import { clientRequest } from "./../../AxiosConfig";
import "./PostProject.css";

class PostProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
    };
  }

  handleChange = ({ name, value }) => {
    this.setState((prevState) => {
      let project = { ...prevState.project };
      project[name] = value;
      return { project };
    });
  };

  handleFilesChange = ({ name, files }) => {
    let value = "";
    if (files.length > 1) {
      value = files.map((file) => {
        return file;
      });
    } else {
      value = files[0];
    }
    this.setState((prevState) => {
      let project = { ...prevState.project };
      project[name] = value;
      return { project };
    });
  };

  proposeProjectHandler = (event, project) => {
    event.preventDefault();
    const url = "/cyobapi/addproject";
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (let key in project) {
      formData.append(key, project[key]);
    }
    clientRequest(token)
      .post(url, formData)
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
        this.setState({ project: {} });
      })
      .catch((err) => {
        console.log("Add Project Error:  ", err);
      });
  };

  render() {
    return (
      <div className='post__project'>
        <h3 className='center'>Propose a Project</h3>
        <form
          encType='multipart/form-data'
          action='/addproject'
          id='post_project'
          onSubmit={(e) => {
            this.proposeProjectHandler(e, this.state.project);
          }}>
          <div className='input__block'>
            <label htmlFor='type'>Project Type: </label>
            <select
              id='proj_type'
              name='type'
              onChange={(e) => this.handleChange(e.target)}>
              <option value='Refuse Dump Site'>Refuse Dump Site</option>
              <option value='Clogged Gutter'>Clogged Gutter</option>
              <option value='Market Cleaning'>Market Cleaning</option>
              <option value='Grass Cutting'>Grass Cutting</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='input__block'>
            <label htmlFor='title'>Title:</label>
            <input
              id='proj_title'
              type='text'
              name='title'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='details'>Details:</label>
            <textarea
              id='proj_details'
              rows='6'
              name='details'
              onChange={(e) => this.handleChange(e.target)}></textarea>
          </div>
          <div className='input__block'>
            <label htmlFor='tools'>Required Tools:</label>
            <input
              id='proj_tools'
              type='text'
              name='tools'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='image_url'>Photos:</label>
            <input
              type='file'
              id='proj_image'
              name='image_url'
              accept='image/*'
              onChange={(e) => this.handleFilesChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='address'>Address:</label>
            <input
              id='proj_address'
              type='text'
              name='address'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='city'>City:</label>
            <input
              id='proj_city'
              type='text'
              name='city'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='duration'>Estimated Duration: </label>
            <input
              id='proj_duration'
              type='text'
              name='estimated_duration'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='input__block'>
            <label htmlFor='max_workers'>No. of Workers:</label>
            <input
              id='proj_max_workers'
              type='number'
              name='max_workers'
              min='1'
              onChange={(e) => this.handleChange(e.target)}
            />
          </div>
          <div className='form__button'>
            <Button type='submit' text='SUBMIT' />
            <a className='cancel-btn' href='/dashboard'>
              Back
            </a>
          </div>
          <hr />
        </form>
      </div>
    );
  }
}

export default PostProject;
