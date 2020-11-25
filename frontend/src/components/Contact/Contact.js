import React from "react";
import Button from "./../Button/Button";
import "./Contact.css";

const Contact = () => {
  return (
    <div className='contact container'>
      <h4>Contact Form</h4>
      <form id='contactform' name='contactform' action='/contactform'>
        <input type='text' id='name' name='name' placeholder='Name' />
        <input
          type='text'
          id='email'
          name='email'
          placeholder='Email address'
        />
        <textarea
          className='materialize-textarea'
          id='subject'
          name='subject'
          placeholder='Write something...'
          data-length='200'></textarea>

        <Button type='submit' text='SUBMIT' />
      </form>
    </div>
  );
};

export default Contact;
