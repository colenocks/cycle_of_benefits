import React from "react";
// import { Link } from "react-router-dom";
import "./MainNav.css";
import Logo from "../../../cyobLogo.png";

const MainNav = () => {
  return (
    <React.Fragment>
      <nav className='cyan darken-3 z-depth-2'>
        <div className='container'>
          <div className='nav-wrapper'>
            <a href='/' className='brand-logo'>
              <img
                id='logo'
                src={Logo}
                alt='Logo'
                height='80px'
                width='100px'
              />
            </a>
            <div
              data-target='mobile-menu'
              className='sidenav-trigger menu-icon'>
              <i className='material-icons'>menu</i>
            </div>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              <li>
                <a href='/'>Home</a>
              </li>
              <li>
                <a href='/projects'>Projects</a>
              </li>
              <li>
                <a href='/about'>About</a>
              </li>
              <li>
                <a href='/login'>Login</a>
              </li>
              <li>
                <a href='/register'>Sign Up</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ul className='sidenav' id='mobile-menu'>
        <li>
          <a className='sidenav-close' href='/'>
            Home
          </a>
        </li>
        <li>
          <a className='sidenav-close' href='/projects'>
            Projects
          </a>
        </li>
        <li>
          <a className='sidenav-close' href='/about'>
            About
          </a>
        </li>
        <li>
          <a className='sidenav-close' href='/login'>
            Login
          </a>
        </li>
        <li>
          <a className='sidenav-close' href='/register'>
            Sign Up
          </a>
        </li>
      </ul>
    </React.Fragment>
  );
};
export default MainNav;
