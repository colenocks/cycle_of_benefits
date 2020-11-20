import React, { Component } from "react";
import Button from "./../Button/Button";
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
        <div className='home__heading'>
          <div className='home__title'>
            <h1>Welcome to the Cycle of benefits</h1>
            <p>...a waste management platform</p>
          </div>
          <div className='home__carousel'>
            <div className='carousel carousel-slider'>
              {this.state.image_url.map((image, index) => {
                <a key={index} className='carousel-item' href='#!'>
                  <img src={image} />
                </a>;
              })}
            </div>
          </div>
        </div>
        <div className='home__body'>
          <div className='home__button'>
            <Button text='Work' link='/login-check' />
            <Button text='Browse Projects' link='/projects' />
            <Button text='Propose Project' link='/login-check' />
          </div>
          <p classNameName='home__text'>
            Sign in to get <strong>rewards</strong>
            by contributing towards making our nation green.
          </p>
        </div>
      </main>
    );
  }
}

export default Home;
