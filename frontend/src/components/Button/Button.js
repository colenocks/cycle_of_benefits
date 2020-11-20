import React from "react";

const Button = (props) => {
  return (
    <button className='my__button'>
      <a href={props.link}>{props.text}</a>
    </button>
  );
};

export default Button;
