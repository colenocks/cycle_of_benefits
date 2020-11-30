import React from "react";
// import { Link } from "react-router-dom";
import "./MainNav.css";
import Logo from "../../../cyobLogo.png";

const MainNav = (props) => {
  const { usersession } = props;
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
            <a href='/' data-target='mobile-menu' className='sidenav-trigger'>
              <i className='material-icons'>menu</i>
            </a>
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
                {usersession ? (
                  <a href='/dashboard'>Profile</a>
                ) : (
                  <a href='/login'>Login</a>
                )}
              </li>
              <li>
                {usersession ? (
                  <a href='/logout'>
                    <span className='red-text'>Log off</span>
                  </a>
                ) : (
                  <a href='/signup'>Sign Up</a>
                )}
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
          {usersession ? (
            <a href='/dashboard'>Profile</a>
          ) : (
            <a href='/login'>Login</a>
          )}
        </li>
        <li>
          {usersession ? (
            <a href='/logout'>
              <span className='red-text'>Log off</span>
            </a>
          ) : (
            <a href='/signup'>Sign Up</a>
          )}
        </li>
      </ul>
    </React.Fragment>
  );
};
export default MainNav;
