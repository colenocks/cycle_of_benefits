import React from "react";

const HowToInfo = () => {
  return (
    <div>
      <h1>
        <strong>How To</strong>
      </h1>
      <div>
        <p>Earn points each time you complete various project tasks</p>
        <p>Redeem your points for reward benefits</p>
      </div>
      <hr />
      <div>
        <h2>Reward Benefits</h2>
        <ul>
          <li>Medical Benefits</li>
          <li>Clothing Benefits</li>
          <li>Educational Benefits</li>
          <li>Cash Benefits</li>
          <li>Food Benefits</li>
          <li>Transportation Benefits</li>
        </ul>
      </div>
      <hr />
      <div>
        <h2>Reward Points</h2>
        <ul>
          <li>
            200 RP: <span className='level1'>#10,000 worth of benefits</span>
          </li>
          <li>
            600 RP:<span className='level1'>#45,000 worth of benefits</span>
          </li>
          <li>
            1000 RP:<span className='level1'>#90,000 worth of beneits</span>
          </li>
        </ul>
      </div>
      <hr />
      <div>
        <h2>How do i earn reward points?</h2>
        <p>
          Complete a project task, upon confirmation of the project being
          complete, the reward points assigned to the project will be
          distributed accordingly amongst enlisted workers/participants.
        </p>
      </div>
      <hr />
      <div>
        <h2>How do use my reward points?</h2>
        <p>
          The amount of points you have can be used to unlock the RP equivalent
          and can then be used to redeem one of any of the benefit types listed
          above.
        </p>
      </div>
    </div>
  );
};

export default HowToInfo;
