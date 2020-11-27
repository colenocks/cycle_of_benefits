import React from "react";
import Button from "./../Button/Button";
import "./Reward.css";

const Reward = (props) => {
  // const {user} = props;
  const user = {};
  return (
    <div className='rewards'>
      <h3>My Rewards</h3>
      <section className='myrewards'>
        <div className='reward-load'>
          <Button id='reload' type='submit' text='Update Points' />
        </div>
        <div className='reward-points'>
          <form action='/redeemreward' id='rewardform'>
            <div>
              <i className='fas fa-trophy fa-2x'></i>
              <p form='rewardform' htmlFor='total'>
                <label htmlFor=''>Total Points: </label>
                <span id='totalpoints'>{user.reward_points}</span>
              </p>
            </div>
            <div>
              <label htmlFor='usedpoints'>Use: </label>
              <input
                id='usedpoints'
                type='number'
                min='0'
                max={user.reward_points}
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
            <div className='form__button'>
              <Button
                id='redeem'
                type='submit'
                className='left-btn my-btn'
                text='Redeem Reward'
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Reward;
