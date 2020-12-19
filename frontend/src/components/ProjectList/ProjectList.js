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
            <h4>Live Projects</h4>
            <h6>
              This is the current list of all Approved Environmental Projects.
              Check out the details and enlist to participate in your project(s)
              of interest in exchange for benefits.
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
                  btnLink={"/project/" + project._id}
                  btnText='view'
                  btnOnClick={viewProject}
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
