import React, { Component } from "react";
import Button from "./../Button/Button";
import axios from "axios";
import "./Reward.css";

class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_points: this.props.profile.points,
      used_points: 0,
      benefit_type: "Medical Benefits",
    };
  }

  handleChange = ({ name, value }) => {
    this.setState((prevState) => {
      let profile = { ...prevState.profile };
      profile[name] = value;
      return { profile };
    });
  };

  redeemRewardHandler = (event, data) => {
    event.preventDefault();
    const { used_points, total_points, benefit_type } = data;
    if (used_points > total_points || total_points === 0) {
      window.M.toast({
        html: "You have insufficient points, earn more points",
      });
      return;
    }
    if (used_points === 0) {
      window.M.toast({
        html: "Select the number of points and benefit you want to redeem",
      });
      return;
    }
    const url = "http://localhost:5000/redeemreward";
    axios
      .put(url, {
        used_points: used_points,
        total_points: total_points,
        benefit_type: benefit_type,
      })
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
        this.setState({ used_points: 0 });
        localStorage.setItem("current_user", JSON.stringify(res.data.userData));
      })
      .catch((err) => {
        console.log("Load Points Fetch err: ", err);
      });
  };

  loadPoints = () => {
    const userId = localStorage.getItem("sessionId");
    const url = "http://localhost:5000/loadpoints";
    if (userId) {
      axios
        .put(url, {})
        .then((res) => {
          if (res.data.errMessage) {
            window.M.toast({ html: res.data.errMessage });
            return;
          }
          window.M.toast({ html: res.data.message });
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.userData)
          );
        })
        .catch((err) => {
          console.log("Load Points Fetch err: ", err);
        });
    }
  };

  render() {
    const { total_points } = this.state;
    return (
      <div className='rewards'>
        <div className='rewards__header'>
          <h3 className='center'>
            My Rewards <i className='fas fa-trophy'></i>
          </h3>
          <span
            className='new badge red accent-3'
            data-badge-caption={total_points || 0}>
            Total Points:{" "}
          </span>
        </div>
        <section className='rewards__section'>
          <div className='load__points'>
            <Button text='Update Points' onClick={() => this.loadPoints()} />
          </div>
          <div className='use-points'>
            <form
              action='/redeemreward'
              className='reward__form'
              onSubmit={(e) => this.redeemRewardHandler(e, this.state)}>
              <div className='input__block'>
                <label htmlFor='usepoints'>Use Points: </label>
                <input
                  id='usepoints'
                  type='number'
                  min='0'
                  max={total_points}
                  onChange={this.handleChange}
                />
              </div>
              <div className='input__block'>
                <label htmlFor='benefit'>Choose Benefit: </label>
                <select
                  id='benefittype'
                  name='benefit'
                  onChange={this.handleChange}>
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
  }
}

export default Reward;
