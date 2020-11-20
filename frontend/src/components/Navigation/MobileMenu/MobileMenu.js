import React from "react";
import "./MobileMenu.css";

const MobileMenu = () => {
  return (
    <React.Fragment>
      <div className='menu__icon'>
        <i className='fas fa-bars fa-2x'></i>
      </div>
      <div className='menu__header'>
        <ul className='menu__list'>
          <li>
            <a className='menu__item' href='/'>
              Home
            </a>
          </li>
          <li>
            <a className='menu__item' href='/projects'>
              Projects
            </a>
          </li>
          <li>
            <a className='menu__item' href='/about'>
              About
            </a>
          </li>
          <li>
            <a className='menu__item' href='/login'>
              Sign In
            </a>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default MobileMenu;
