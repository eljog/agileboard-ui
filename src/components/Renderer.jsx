import React, { Fragment, Component } from "react";
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
    console.log("Eljo:" + JSON.stringify(this.state));
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

  filterStoriesByStatus = status => {
    const newStories = this.state.stories.filter(story => {
      return story.status === status;
    });
    return newStories;
  };

  appendNewStory = story => {
    console.log("Appending new Story!");
    const stories = this.state.stories;
    stories.push(story);
    this.setState({ stories: stories });
  };

  refreshUpdatedStory = updatedStory => {
    console.log("Refreshing updated Story!");
    const stories = this.state.stories.filter(story => {
      return story.id !== updatedStory.id;
    });
    stories.push(updatedStory);
    this.setState({ stories: stories });
  };

  fetchStoriesForProject = () => {
    console.log("Fetching");
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    const query = `query { 
      getStoriesByProject(projectId: ${this.props.loginState.project.id}) {
          id
          name
          details
          status
          points
          owner {
              name
              id
            }
          project {
            id
            name
          }
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
        console.log(res.data.data.getStoriesByProject);
        this.setState({ stories: res.data.data.getStoriesByProject });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
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
    this.fetchStoriesForProject();
    this.fetchProjectMembers();
  }
}

export default Renderer;
