import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import StoryCard from "./StoryCard";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";
import axios from "axios";
import AppBar from "./AppBar";
import API_URL from "../ApiAdapter";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "90vw",
    marginLeft: "5vw",
    marginTop: "5px",
    minHeight: "100vh"
  },
  column: {
    minWidth: "18vw",
    minHeight: "100%"
  },
  paper: {
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: grey[100]
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

const columns = [
  { key: "new", title: "New", status: "New" },
  { key: "ready", title: "Ready", status: "Ready" },
  { key: "inprogress", title: "In Progress", status: "InProgress" },
  { key: "completed", title: "Completed", status: "Completed" },
  { key: "accepted", title: "Accepted", status: "Accepted" }
];

class GuttersGrid extends Component {
  state = {
    teamMembers: [],
    stories: [],
    error: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar
          fetchStories={this.fetchStories}
          appendNewStory={this.appendNewStory}
          teamMembers={this.state.teamMembers}
          statusColumns={columns}
          loginState={this.props.loginState}
        />
        <Grid
          container
          className={classes.root}
          spacing={16}
          justify="center"
          wrap="nowrap"
        >
          {columns.map(column => (
            <Grid key={column.key} className={classes.column} item>
              <Paper className={classes.paper}>
                <Typography
                  gutterBottom
                  variant="h6"
                  align="center"
                  component="h2"
                >
                  {column.title}
                </Typography>
                {this.filterStoriesByStatus(column.status).map(story => (
                  <StoryCard
                    key={story.id}
                    id={story.id}
                    name={story.name}
                    details={story.details}
                    ownerName={story.owner.name}
                    status={story.owner.status}
                    story={story}
                    teamMembers={this.state.teamMembers}
                    statusColumns={columns}
                    refreshUpdatedStory={this.refreshUpdatedStory}
                    loginState={this.props.loginState}
                  />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  filterStoriesByStatus(status) {
    const newStories = this.state.stories.filter(story => {
      return story.status === status;
    });
    return newStories;
  }

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

export default withStyles(styles)(GuttersGrid);
