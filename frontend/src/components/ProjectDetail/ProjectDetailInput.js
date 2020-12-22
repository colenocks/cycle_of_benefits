import React from "react";

const ProjectDetailInput = (props) => {
  <div key={props.project._id} className='view__block'>
    <label htmlFor={props.project.name}>{props.project.label} </label>
    <input
      className={props.project.style}
      type={props.project.type}
      name={props.project.name}
      id={props.project.id}
      defaultValue={props.project.value}
      disabled={props.project.disabled}
      onChange={() => props.project.handleChange()}
    />
  </div>;
};

export default ProjectDetailInput;
