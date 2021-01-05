import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const date = new Date();
  return (
    <footer className='main__footer cyan darken-3'>
      <ul className='footer__link'>
        <h5 className='white-text'>Links</h5>
        <li className='footer__link_item'>
          <Link className='grey-text text-lighten-3' to='/contact-us'>
            Contact Us
          </Link>
        </li>
        <li className='footer__link_item'>
          <Link className='grey-text text-lighten-3' to='/about'>
            About
          </Link>
        </li>
        <li className='footer__link_item'>
          <Link className='grey-text text-lighten-3' to='/'>
            Market Place
          </Link>
        </li>
      </ul>
      <p className='grey-text text-lighten-3'>
        All rights reserved | Created & Designed by Coleman &copy;{" "}
        {date.getFullYear()}
      </p>
      <div className='footer__icon'>
        <a
          className='grey-text text-lighten-3'
          href='https://www.github.com/colenocks'
          target='_blank'
          rel='noreferrer'>
          <i className='fab fa-github fa-2x'></i>
        </a>
        <a
          className='grey-text text-lighten-3'
          href='https://www.linkedin.com/in/coleman-enocks'
          target='_blank'
          rel='noreferrer'>
          <i className='fab fa-linkedin fa-2x'></i>
        </a>
        <a
          className='grey-text text-lighten-3'
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
