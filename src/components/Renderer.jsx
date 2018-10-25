import React, { Component } from "react";
import PersistentDrawer from "./DrawerMenu";
import axios from "axios";
import API_URL from "../ApiAdapter";

const columns = [
  { key: "new", title: "New", status: "New" },
  { key: "ready", title: "Ready", status: "Ready" },
  { key: "inprogress", title: "In Progress", status: "InProgress" },
  { key: "completed", title: "Completed", status: "Completed" },
  { key: "accepted", title: "Accepted", status: "Accepted" }
];

class Renderer extends Component {
  state = {
    teamMembers: [],
    stories: [],
    error: false
  };

  render() {
    return (
      <PersistentDrawer
        loginState={this.props.loginState}
        teamMembers={this.getTeamMembers}
        statusColumns={columns}
        refreshUpdatedStory={this.refreshUpdatedStory}
        loginState={this.props.loginState}
        filterStoriesByStatus={this.filterStoriesByStatus}
        fetchStoriesForProject={this.fetchStoriesForProject}
        appendNewStory={this.appendNewStory}
        updatedStory={this.refreshUpdatedStory}
        logout={this.props.logout}
      />
    );
  }

  getTeamMembers = () => {
    return this.state.teamMembers;
  };

  fetchProjectMembers = () => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    const query = `query { 
      getUsersByProject(projectId: ${this.props.loginState.project.id}) {
        id
        name
      }
    }`;
    const variables = null;

    let data = {
      query: query,
      variables: variables
    };

    axios
      .post(`${API_URL}/graphql`, data, config)
      .then(res => {
        console.log(res.data.data.getUsersByProject);
        this.setState({ teamMembers: res.data.data.getUsersByProject });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
  };

  componentDidMount() {
    if (this.props.loginState.project) {
      this.fetchProjectMembers();
    }
  }
}

export default Renderer;
