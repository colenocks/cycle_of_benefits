import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const Button = (props) => {
  return (
    <button
      className={props.disabled ? "my__button disabled" : "my__button"}
      type={props.type ? props.type : ""}
      disabled={props.disabled === true ? props.disabled : false}>
      {props.link ? (
        <Link to={props.link}>{props.text ? props.text : props.icon}</Link>
      ) : (
        props.text
      )}
    </button>
  );
};

export default Button;
