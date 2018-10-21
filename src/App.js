import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import StoryGrid from "./components/StoryGrid";
import Login from "./components/Login";
import axios from "axios";
import API_URL from "./ApiAdapter";

class App extends Component {
  state = {
    login: {
      status: false,
      token: "",
      currrentUser: null
    }
  };

  setLogin = loginState => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${loginState.token}`
      }
    };

    axios
      .get(`${API_URL}/user/me`, config)
      .then(res => {
        loginState.currrentUser = res.data;
        loginState.project = loginState.currrentUser.project;
        console.log("LoginState: " + JSON.stringify(loginState));
        this.setState({ login: loginState });
      })
      .catch(err => {
        console.log("Login Failed: " + err.message);
      });
  };

  conditionalRender = () => {
    if (this.state.login.status) {
      if (this.state.login.currrentUser.project) {
        return <StoryGrid loginState={this.state.login} />;
      } else {
        return <div>You dont have any Project</div>;
      }
    } else {
      return <Login setLogin={this.setLogin} loginState={this.state.login} />;
    }
  };

  render() {
    return <div className="App">{this.conditionalRender()}</div>;
  }
}

export default App;
