import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login";
import axios from "axios";
import API_URL from "./ApiAdapter";
import Renderer from "./components/Renderer";
import Register from "./components/Register";

class App extends Component {
  storage = undefined;
  state = {};

  static emptyLogin = {
    status: false,
    token: "",
    currentUser: null
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

  getProject = () => {
    console.log("App::getProject");
    return this.state.login.project;
  };

  setLogin = loginState => {
    console.log("App::setLogin");
    this.decideStorage(loginState.remember);
    this.setUserAndProject(loginState);
  };

  setUserAndProject = loginState => {
    console.log("App::setUserAndProject");
    // let loginState = this.state.login;

    const config = {
      headers: {
        "content-type": "application/json",
        authorization: `${loginState.token}`
      }
    };

    axios
      .get(`${API_URL}/user/me`, config)
      .then(res => {
        loginState.currentUser = res.data;
        loginState.project = loginState.currentUser.project;
        console.log("Updated LoginState: " + JSON.stringify(loginState));
        this.setState({ login: loginState });

        this.storage.setItem("login", JSON.stringify(this.state.login));
      })
      .catch(err => {
        console.log("Fetching /user/me Failed: " + err.message);
      });
  };

  logout = () => {
    this.setState({ login: App.emptyLogin });
    this.storage.clear();
  };

  showLogin = () => {
    console.log("App::showLogin");
    this.setState({ showRegister: false });
  };

  showRegister = () => {
    console.log("App::showRegister");
    this.setState({ showRegister: true });
  };

  loginOrRegister = () => {
    const form = this.state.showRegister ? (
      <Register showLogin={this.showLogin} />
    ) : (
      <Login
        setLogin={this.setLogin}
        showRegister={this.showRegister}
        loginState={this.state.login}
      />
    );

    return form;
  };

  conditionalRender = () => {
    if (this.state.login.status) {
      return (
        <Renderer
          loginState={this.state.login}
          logout={this.logout}
          setUserAndProject={this.setUserAndProject}
          getProject={this.getProject}
        />
      );
    } else {
      return this.loginOrRegister();
    }
  };

  render() {
    return <div className="App">{this.conditionalRender()}</div>;
  }
}

export default App;
