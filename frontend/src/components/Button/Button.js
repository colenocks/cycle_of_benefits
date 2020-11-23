import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const Button = (props) => {
  return (
    <button className='my__button'>
      <Link to={props.link}>{props.text || props.icon}</Link>
    </button>
  );
};

export default Button;
