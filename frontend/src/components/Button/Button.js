import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const Button = (props) => {
  return (
    <button className='my__button' type={props.type ? props.type : ""}>
      {props.link ? (
        <Link to={props.link}>{props.text ? props.text : props.icon}</Link>
      ) : (
        props.text
      )}
    </button>
  );
};

export default Button;
