import React, { Component, Fragment } from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";
import RefreshIcon from "@material-ui/icons/RefreshOutlined";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "axios";

import StoryCard from "./StoryCard";
import CreateStoryDialog from "./CreateStoryDialog";
import API_URL from "../ApiAdapter";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
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
  },
  button: {
    margin: theme.spacing.unit
  },
  error: {
    color: "red"
  },
  progress: {
    marginTop: "30vh",
    position: "absolute",
    zIndex: 1
  }
});

class GuttersGrid extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    stories: [],
    error: "",
    loading: false
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        {this.state.error && (
          <span className={classes.error}>{this.state.error}</span>
        )}
        {this.state.loading && (
          <CircularProgress className={classes.progress} />
        )}
        <Grid
          container
          className={classes.root}
          spacing={16}
          justify="center"
          wrap="nowrap"
        >
          <div>
            <Button
              variant="fab"
              mini
              color="secondary"
              aria-label="Add"
              className={classes.button}
              onClick={this.fetchStoriesForProject}
            >
              <RefreshIcon />
            </Button>
            <Button
              variant="fab"
              mini
              color="secondary"
              aria-label="Add"
              className={classes.button}
            >
              <CreateStoryDialog
                appendNewStory={this.appendNewStory}
                teamMembers={this.props.teamMembers}
                statusColumns={this.props.statusColumns}
                loginState={this.props.loginState}
              />
            </Button>
          </div>
          {this.props.statusColumns.map(column => (
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
                    teamMembers={this.props.teamMembers}
                    statusColumns={this.props.statusColumns}
                    refreshUpdatedStory={this.refreshUpdatedStory}
                    loginState={this.props.loginState}
                  />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Fragment>
    );
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
    console.log("StoryGrid::fetchStoriesForProject");
    this.setState({ error: "", loading: true });

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
        this.setState({
          stories: res.data.data.getStoriesByProject,
          loading: false
        });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
        this.setState({ error: "❌" + err.message });
      });
  };

  filterStoriesByStatus = status => {
    const newStories = this.state.stories.filter(story => {
      return story.status === status;
    });
    return newStories;
  };

  componentDidMount() {
    this.fetchStoriesForProject();
  }
}

export default withStyles(styles)(GuttersGrid);
