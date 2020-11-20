import React from "react";
import "./MainNav.css";

const MainNav = () => {
  const image_url =
    "https://res.cloudinary.com/icardi/image/upload/v1577780709/cyobLogo_200x200_gy6opt.png";
  return (
    <nav className='nav__header'>
      <div className='logo__div'>
        <a href='/'>
          <img src={image_url} alt='Logo' height='80px' width='80px' />
        </a>
        <p>
          <a href='/'>Cycle of Benefits</a>
        </p>
        {/* Fit MobileMenu component here */}
        <div className='nav__menu'>
          <ul className='nav__list'>
            <li className='nav__item'>
              <a href='/'>Home</a>
            </li>
            <li className='nav__item'>
              <a href='/projects'>Projects</a>
            </li>
            <li className='nav__item'>
              <a href='/about'>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='signin'>
        <a className='signin__link' href='/login'>
          Login
        </a>
        <a className='signin__link' href='/register'>
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default MainNav;
