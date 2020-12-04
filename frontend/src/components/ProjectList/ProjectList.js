import React, { Fragment, Component } from "react";
import { CyobConsumer } from "../../contextAPI/context";
import Button from "../Button/Button";
import "./ProjectList.css";

class ProjectList extends Component {
  render() {
    return (
      <Fragment>
        <CyobConsumer>
          {(value) => {
            const { projects, getProject } = value;
            return (
              <div className='project'>
                <div className='project__header'>
                  <h4>Active Projects</h4>
                  <h6>
                    Current list of all approved Projects. Enroll for projects
                    that interests you and earn rewards.
                  </h6>
                </div>
                <div className='project__list'>
                  <ul className='project__pills'>
                    <li className='project__heading teal-text'>
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
                    </li>
                    {projects.map((project, index) => {
                      return (
                        <li
                          key={project._id}
                          className={
                            project.status === "Completed"
                              ? "project_ grey"
                              : "project_"
                          }>
                          <div className='project__id'>{index + 1}</div>
                          <div className='project__title'>{project.title}</div>
                          <div className='project__status'>
                            {project.status}
                          </div>
                          <div className='project__worth'>
                            {project.reward_points}
                          </div>
                          <div className='project__workers'>
                            {project.current_workers +
                              "/" +
                              project.max_workers}
                          </div>
                          <div className='project__posted'>
                            {project.posted_by}
                          </div>
                          <div className='project__button'>
                            <Button
                              text='view'
                              onClick={() => getProject(project._id)}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                ;
              </div>
            );
          }}
        </CyobConsumer>
      </Fragment>
    );
  }
}

export default ProjectList;
