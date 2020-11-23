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
            <h2>Welcome to the Cycle of benefits</h2>
            <p>...a waste management platform</p>
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
                  <span className='card-title'>Work on Projects</span>
                  <p>
                    I am a very simple card. I am good at containing small bits
                    of information. I am convenient because I require little
                    markup to use effectively.
                  </p>
                </div>
                <div className='card-action'>
                  <Button
                    link='/login-check'
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
                  <span className='card-title'>Find Projects</span>
                  <p>
                    I am a very simple card. I am good at containing small bits
                    of information. I am convenient because I require little
                    markup to use effectively.
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
                  <span className='card-title'>Propose a Project</span>
                  <p>
                    I am a very simple card. I am good at containing small bits
                    of information. I am convenient because I require little
                    markup to use effectively.
                  </p>
                </div>
                <div className='card-action'>
                  <Button
                    link='/login-check'
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
