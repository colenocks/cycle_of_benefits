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
    this.setState({
      [name]: value,
    });
  };

  redeemRewardHandler = (event, data) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/redeemreward";
    axios
      .put(
        url,
        {
          used_points: data.used_points,
          total_points: data.total_points,
          benefit_type: data.benefit_type,
        },
        { headers: { Authorization: `bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
        this.setState({ used_points: 0, benefit_type: "Medical Benefits" });
        localStorage.setItem("current_user", JSON.stringify(res.data.userData));
      })
      .catch((err) => {
        console.log("Load Points Fetch err: ", err);
      });
  };

  loadPoints = () => {
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/loadpoints";
    axios
      .get(url, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.errMessage) {
          window.M.toast({ html: res.data.errMessage });
          return;
        }
        window.M.toast({ html: res.data.message });
        if (res.data.userData) {
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.userData)
          );
        }
      })
      .catch((err) => {
        console.log("Load Points Fetch err: ", err);
      });
  };

  render() {
    const { points: total_points } = this.props.profile;
    return (
      <div className='rewards'>
        <div className='rewards__header'>
          <h3 className='center'>
            My Rewards <i className='fas fa-trophy'></i>
          </h3>
          <div className='total-points'>Total Points: {total_points}</div>
        </div>
        <section className='rewards__section'>
          <div className='load__points'>
            <Button text='Update Points' onClick={() => this.loadPoints()} />
          </div>
          <div className='use-points'>
            <form
              className='reward__form'
              onSubmit={(e) => this.redeemRewardHandler(e, this.state)}>
              <div className='input__block'>
                <label htmlFor='used_points'>Use Points: </label>
                <input
                  name='used_points'
                  id='usepoints'
                  type='number'
                  min='0'
                  max={total_points}
                  onChange={(e) => this.handleChange(e.target)}
                  defaultValue={this.state.used_points}
                />
              </div>
              <div className='input__block'>
                <label htmlFor='benefit'>Choose Benefit: </label>
                <select
                  id='benefittype'
                  name='benefit_type'
                  onChange={(e) => this.handleChange(e.target)}>
                  <option defaultValue='' disabled hidden>
                    Select a benefit
                  </option>
                  <option value='Medical Benefits'>Medical Benefits</option>
                  <option value='Clothing Benefits'>Clothing Benefits</option>
                  <option value='Educational Benefits'>
                    Educational Benefits
                  </option>
                  <option value='Cash Benefits'>Cash Benefits</option>
                  <option value='Food Benefits'>Food Benefits</option>
                  <option value='Transportation Benefits'>
                    Transportation Benefits
                  </option>
                </select>
              </div>
              <div className='form__button'>
                <Button type='submit' text='Redeem Reward' />
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default Reward;
