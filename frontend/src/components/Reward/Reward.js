import React from "react";

const Reward = () => {
  return (
    <div>
      <h1>My Rewards</h1>
      <section className='myrewards'>
        <div className='reward-load form-button'>
          <label htmlFor='reload'>Click to update your Points: </label>
          <input
            id='reload'
            type='submit'
            className='left-btn my-btn'
            value='Get Points'
          />
        </div>
        <div className='reward-points'>
          <form action='/redeemreward' id='rewardform'>
            <div>
              <i className='fas fa-trophy fa-2x'></i>
              <p form='rewardform' htmlFor='total'>
                Total Points:{" "}
                <span id='totalpoints'>{"project.reward_points"}</span>
              </p>
            </div>
            <div>
              <label htmlFor='usedpoints'>Use: </label>
              <input
                id='usedpoints'
                type='number'
                min='0'
                max={"project.reward_points"}
              />
            </div>
            <div>
              <label htmlFor='benefit'>Choose Benefit: </label>
              <select id='benefittype' name='benefit'>
                <option value='medical'>Medical Benefits</option>
                <option value='clothing'>Clothing Benefits</option>
                <option value='educational'>Educational Benefits</option>
                <option value='cash'>Cash Benefits</option>
                <option value='food'>Food Benefits</option>
                <option value='transport'>Transportation Benefits</option>
              </select>
            </div>
            <div className='form-button'>
              <input
                id='redeem'
                type='submit'
                className='left-btn my-btn'
                value='Redeem Reward'
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Reward;
