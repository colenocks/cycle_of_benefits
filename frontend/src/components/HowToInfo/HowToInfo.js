import React from "react";
import "./HowToInfo.css";

const HowToInfo = () => {
  return (
    <div className='information'>
      <div className='information__heading'>
        <h3 className='center'>
          How it Works <i className='material-icons'>priority_high</i>
        </h3>
        <p>
          It's simple! Earn points each time you complete various project tasks.
          The points are automatically converted to the benefits of your
          choosing when you redeem them.
        </p>
      </div>
      <hr />
      <ul className='collapsible'>
        <li>
          <div className='collapsible-header'>Available Benefits</div>
          <div className='collapsible-body'>
            <ol>
              <li>Medical Benefits</li>
              <li>Clothing Benefits</li>
              <li>Educational Benefits</li>
              <li>Cash Benefits</li>
              <li>Food Benefits</li>
              <li>Transportation Benefits</li>
            </ol>
          </div>
        </li>
        <li>
          <div className='collapsible-header'>
            What are the reward points worth?
          </div>
          <div className='collapsible-body'>
            <ol>
              <li>
                10 RP - <span className='green-text'> &#8358;500</span>
              </li>
              <li>
                50 RP - <span className='green-text'>&#8358;2,500</span>
              </li>
              <li>
                100 RP - <span className='green-text'>&#8358;5,000</span>
              </li>
              <li>
                200 RP - <span className='green-text'>&#8358;10,000</span>
              </li>
              <li>
                700 RP - <span className='green-text'>&#8358;45,000</span>
              </li>
              <li>
                1500 RP - <span className='green-text'>&#8358;90,000</span>
              </li>
            </ol>
          </div>
        </li>
        <li>
          <div className='collapsible-header'>How do I earn reward points?</div>
          <div className='collapsible-body'>
            Complete a project task. Upon confirmation of the project being
            complete, the reward points assigned to the project will be
            distributed accordingly amongst enlisted workers.
          </div>
        </li>
        <li>
          <div className='collapsible-header'>
            How do I use my reward points?
          </div>
          <div className='collapsible-body'>
            The amount of points you have gained can be to used unlock one of
            the benefit types listed above.
          </div>
        </li>
        <li>
          <div className='collapsible-header'>For more enquiries?</div>
          <div className='collapsible-body'>
            <a href='contact-us'>Contact Us</a>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default HowToInfo;
