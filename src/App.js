import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login";
import axios from "axios";
import API_URL from "./ApiAdapter";
import Renderer from "./components/Renderer";

class App extends Component {
  storage = undefined;
  state = {};

  static emptyLogin = {
    status: false,
    token: "",
    currrentUser: null
  };

  constructor(props) {
    super(props);
    if (JSON.parse(localStorage.getItem("login"))) {
      this.storage = localStorage;
    } else {
      this.storage = sessionStorage;
    }

    const savedLogin = JSON.parse(this.storage.getItem("login"));
    if (savedLogin) {
      this.state = { login: savedLogin };
    } else {
      this.state = {
        login: App.emptyLogin
      };
    }
  }

  decideStorage = remember => {
    if (remember) {
      sessionStorage.clear();
      this.storage = localStorage;
    } else {
      localStorage.clear();
      this.storage = sessionStorage;
    }
  };

  setLogin = loginState => {
    this.decideStorage(loginState.remember);

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

        this.storage.setItem("login", JSON.stringify(this.state.login));
      })
      .catch(err => {
        console.log("Login Failed: " + err.message);
      });
  };

  logout = () => {
    this.setState({ login: App.emptyLogin });
    this.storage.clear();
  };

  conditionalRender = () => {
    if (this.state.login.status) {
      return <Renderer loginState={this.state.login} logout={this.logout} />;
    } else {
      return <Login setLogin={this.setLogin} loginState={this.state.login} />;
    }
  };

  render() {
    return <div className="App">{this.conditionalRender()}</div>;
  }
}

export default App;
