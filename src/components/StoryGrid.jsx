import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import StoryCard from "./StoryCard";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";
import RefreshIcon from "@material-ui/icons/RefreshOutlined";
import CreateStoryDialog from "./CreateStoryDialog";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "90vw",
    marginLeft: "2.5vw",
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
  },
  button: {
    margin: theme.spacing.unit
  }
});

class GuttersGrid extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    console.log("Props: " + JSON.stringify(props));
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
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
              onClick={this.props.fetchStoriesForProject}
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
                appendNewStory={this.props.appendNewStory}
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
                {this.props.filterStoriesByStatus(column.status).map(story => (
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
                    refreshUpdatedStory={this.props.refreshUpdatedStory}
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
}

export default withStyles(styles)(GuttersGrid);
