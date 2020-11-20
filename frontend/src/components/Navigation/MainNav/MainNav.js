import React from "react";
import { Link } from "react-router-dom";
import "./MainNav.css";

const MainNav = () => {
  const image_url =
    "https://res.cloudinary.com/icardi/image/upload/v1577780709/cyobLogo_200x200_gy6opt.png";
  return (
    <React.Fragment>
      <nav className='teal darken-3 z-depth-2'>
        <div className='container'>
          <div className='nav-wrapper'>
            <Link to='/' className='brand-logo'>
              <img
                id='logo'
                src={image_url}
                alt='Logo'
                height='80px'
                width='100px'
              />
            </Link>
            <Link to='#!' data-target='mobile-menu' className='sidenav-trigger'>
              <i className='material-icons'>menu</i>
            </Link>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/projects'>Projects</Link>
              </li>
              <li>
                <Link to='/about'>About</Link>
              </li>
              <li>
                <Link to='/login'>Login</Link>
              </li>
              <li>
                <Link to='/register'>Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ul className='sidenav' id='mobile-menu'>
        <li>
          <Link className='sidenav-close' to='/'>
            Home
          </Link>
        </li>
        <li>
          <Link className='sidenav-close' to='/projects'>
            Projects
          </Link>
        </li>
        <li>
          <Link className='sidenav-close' to='/about'>
            About
          </Link>
        </li>
        <li>
          <Link className='sidenav-close' to='/login'>
            Login
          </Link>
        </li>
        <li>
          <Link className='sidenav-close' to='/register'>
            Sign Up
          </Link>
        </li>
      </ul>
    </React.Fragment>
  );
};
export default MainNav;
