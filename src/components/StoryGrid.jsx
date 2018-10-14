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

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "80%",
    marginLeft: "10%",
    marginTop: "5px",
    minHeight: "100vh"
  },
  row: {
    width: "100%",
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
        />
        <Grid
          container
          className={classes.root}
          spacing={16}
          justify="center"
          wrap="nowrap"
        >
          {columns.map(column => (
            <Grid key={column.key} className={classes.row} item>
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

  fetchStories = () => {
    const query = `query { 
        getStories {
        id
        name
        details
        status
        owner {
            name
            id
          }
        }
    }`;
    const variables = null;

    let data = {
      query: query,
      variables: variables
    };

    axios
      .post(`http://localhost:8889/graphql`, data)
      .then(res => {
        console.log(res.data.data.getStories);
        this.setState({ stories: res.data.data.getStories });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
  };

  fetchUsers = () => {
    const query = `query { 
      getUsers {
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
      .post(`http://localhost:8889/graphql`, data)
      .then(res => {
        console.log(res.data.data.getUsers);
        this.setState({ teamMembers: res.data.data.getUsers });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
  };

  componentDidMount() {
    this.fetchStories();
    this.fetchUsers();
  }
}

export default withStyles(styles)(GuttersGrid);
