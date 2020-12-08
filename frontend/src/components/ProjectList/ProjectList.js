import React, { Fragment, Component } from "react";
import ProjectHeading from "../Project/ProjectHeading";
import Project from "./../Project/Project";
import "./ProjectList.css";

class ProjectList extends Component {
  render() {
    const { projects, viewProject } = this.props;
    return (
      <Fragment>
        <div className='project'>
          <div className='project__header'>
            <h4>Active Projects</h4>
            <h6>
              Current list of all approved Projects. Enroll for projects that
              interests you and earn rewards.
            </h6>
          </div>

          <div className='project__list'>
            <ProjectHeading />
            {projects.map((project, index) => {
              return (
                <Project
                  key={project._id}
                  index={index}
                  project={project}
                  viewProject={viewProject}
                />
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ProjectList;
