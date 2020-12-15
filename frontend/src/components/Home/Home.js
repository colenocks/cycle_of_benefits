import React, { Component } from "react";
import Button from "./../Button/Button";
import { Link } from "react-router-dom";
import "./Home.css";

class Home extends Component {
  state = {
    image_url: [
      "https://res.cloudinary.com/icardi/image/upload/v1578124703/cyob_images/images_3_xwqe4l.jpg",
      "https://res.cloudinary.com/icardi/image/upload/v1578124700/cyob_images/1000x-1_n66dfc.jpg",
      "https://res.cloudinary.com/icardi/image/upload/v1578124700/cyob_images/lagos-flood_xq4j7i.jpg",
      "https://res.cloudinary.com/icardi/image/upload/v1578124699/cyob_images/flood-Lagos-1024x575_hw0kgt.jpg",
      "https://res.cloudinary.com/icardi/image/upload/v1578124699/cyob_images/images_1_csv9au.jpg",
    ],
  };
  render() {
    return (
      <main className='home'>
        <div className='section home__heading'>
          <div className='home__title'>
            <h2>The Cycle of benefits</h2>
            <h5>
              ...a waste management platform. Enlist for environmental projects
              in exchange for benefits.{" "}
            </h5>
          </div>
          <div className='home__carousel'>
            <div className='carousel carousel-slider'>
              {this.state.image_url.map((image, index) => {
                return (
                  <Link key={index} className='carousel-item' to='#!'>
                    <img src={image} alt={`carousel-${index}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className='section home__body'>
          <div className='row'>
            <div className='col s12 m6 l4'>
              <div className='card hoverable'>
                <div className='card-content'>
                  <span className='card-title center'>Find My Projects</span>
                  <p>
                    The platform is populated with environmental sanitation
                    projects that are tagged with different rewards options and
                    a time period or limit, depending on the amount of work to
                    be carried out or the number of workers involved.
                  </p>
                </div>

                <div className='card-action'>
                  <Button
                    link='/login'
                    icon={
                      <i className='material-icons'>keyboard_arrow_right</i>
                    }
                  />
                </div>
              </div>
            </div>
            <div className='col s12 m6 l4'>
              <div className='card hoverable'>
                <div className='card-content'>
                  <span className='card-title center'>Work on Projects</span>
                  <p>
                    Upon completion and after confirmation from a project
                    verification body, the workers are awarded equal number of
                    points based on the total number of reward points the
                    projects bears. They can cash out in form of the benefits of
                    their choice from the available options.
                  </p>
                </div>
                <div className='card-action'>
                  <Button
                    link='/projects'
                    icon={
                      <i className='material-icons'>keyboard_arrow_right</i>
                    }
                  />
                </div>
              </div>
            </div>
            <div className='col s12 m6 l4'>
              <div className='card hoverable'>
                <div className='card-content'>
                  <span className='card-title center'>Propose a Project</span>
                  <p>
                    Although, only registered users can log into the system and
                    enrol to work on one or more "Open" projects, any users can
                    contact us if you want to propose a project. The project
                    will be reviewed and uploaded for the public after approval.
                  </p>
                </div>
                <div className='card-action'>
                  <Button
                    link='/login'
                    icon={
                      <i className='material-icons'>keyboard_arrow_right</i>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <p className='home__text'>
            Sign in to get <strong>rewards </strong>
            by contributing towards making our nation green.
          </p>
        </div>
      </main>
    );
  }
}

export default Home;
