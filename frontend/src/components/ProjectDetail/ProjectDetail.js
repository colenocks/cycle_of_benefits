import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./ProjectDetail.css";

class ProjectDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
      disabled: true,
    };
  }

  componentDidMount() {
    const current_project = JSON.parse(localStorage.getItem("current_project"));
    if (current_project) {
      this.setState({ project: current_project });
    }
  }

  handleChange = ({ name, value }) => {
    this.setState((prevState) => {
      let project = { ...prevState.project };
      project[name] = value;
      return { project };
    });
  };

  toggleAdminFunctions() {
    let { disabled } = this.state;
    disabled ? (disabled = false) : (disabled = true);
    this.setState({ disabled });
  }

  render() {
    const { isAdmin, enrolWorker, approveProject, updateProject } = this.props;
    const { project } = this.state;

    return project === {} ? (
      <h4 className='no_project'>refresh project</h4>
    ) : (
      <div className='view__project'>
        {/* <Link className='cancel-btn' to='/projects'>
          go back
        </Link> */}
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
          <form name='project-form' id='project-form'>
            <div className='view__block'>
              <label htmlFor='type'>Type: </label>
              <input
                className='view__type'
                type='text'
                name='type'
                id='type'
                defaultValue={project.type}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='title'>Title: </label>{" "}
              <input
                className='view__title'
                type='text'
                name='title'
                defaultValue={project.title}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='details'>Details: </label>
              <input
                className='view__details'
                type='text'
                name='details'
                defaultValue={project.details}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='duration'> Duration: </label>
              <input
                className='view__duration'
                type='text'
                name='duration'
                defaultValue={project.estimated_duration}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='address'>Address: </label>
              <input
                className='view__address'
                type='text'
                name='address'
                defaultValue={project.address}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='city'>City: </label>
              <input
                className='view__city'
                type='text'
                name='city'
                defaultValue={project.city}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='status'>Status: </label>
              <input
                className='view__status'
                type='text'
                name='status'
                defaultValue={project.status}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='tools'>Tools: </label>
              <input
                className='view__tools'
                type='text'
                name='tools'
                defaultValue={project.tools}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='current_workers'>Current Workers: </label>
              <input
                className='view__current_workers'
                type='text'
                name='current_workers'
                defaultValue={project.current_workers}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='no_of_workers'>Maximum Workers: </label>
              <input
                className='view__no_of_workers'
                type='text'
                name='no_of_workers'
                defaultValue={project.max_workers}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='worth'>Total Points: </label>
              <input
                className='view__worth'
                type='text'
                name='worth'
                defaultValue={project.reward_points}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='view__block'>
              <label htmlFor='posted_by'>Posted By: </label>
              <input
                className='view__posted_by'
                type='text'
                name='posted_by'
                defaultValue={project.posted_by}
                disabled={this.state.disabled}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-button'>
              <Button
                id='interest'
                text='ENROL'
                onClick={(e) => enrolWorker(e, project._id)}
              />
              <Link className='cancel-btn' to='/projects'>
                Back
              </Link>
            </div>
            <hr />
            <div
              className={isAdmin ? "show-admin-control" : "hide-admin-control"}>
              <Button text='EDIT' onClick={this.toggleAdminFunctions} />
              <Button
                text='ADD TO LIST'
                onClick={(e) => approveProject(e, project._id)}
                disabled={this.state.disabled}
              />
              <Button
                text='UPDATE PROJECT'
                onClick={(e) => updateProject(e, project._id)}
                disabled={this.state.disabled} //Optional
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProjectDetail;
