import React from "react";
import "./Footer.css";

const Footer = () => {
  const date = new Date();
  return (
    <footer className='main__footer'>
      <ul className='footer__link'>
        <li className='footer__link_item'>
          <a href='/contact'>Contact Us</a>
        </li>
        <li className='footer__link_item'>
          <a href='/about'>About</a>
        </li>
        <li className='footer__link_item'>
          <a className='green-text' href='#!'>
            Market Place
          </a>
        </li>
      </ul>
      <p>
        All rights reserved | Created & Designed by Coleman &copy;{" "}
        {date.getFullYear()}
      </p>
      <div className='footer__icon'>
        <a
          href='https://www.github.com/colenocks'
          target='_blank'
          rel='noreferrer'>
          <i className='fab fa-github fa-2x'></i>
        </a>
        <a
          href='https://www.linkedin.com/In/coleman-enocks'
          target='_blank'
          rel='noreferrer'>
          <i className='fab fa-linkedin fa-2x'></i>
        </a>
        <a
          href='https://www.twitter.com/encole9'
          target='_blank'
          rel='noreferrer'>
          <i className='fab fa-twitter fa-2x'></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
