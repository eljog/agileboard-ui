import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import StoryGrid from "./components/StoryGrid";

class App extends Component {
  render() {
    return (
      <div className="App">
        <StoryGrid />
      </div>
    );
  }
}

export default App;
