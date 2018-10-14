import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import EditStoryDialog from "./EditStoryDialog";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  card: {
    maxWidth: "350px",
    margin: "5px"
  },

  media: {
    objectFit: "cover"
  },

  avatar: {
    backgroundColor: "red"
  }
});

class StoryCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  dragged = p => {
    console.log("Dropped : " + p.name);
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                <img
                  src={`https://placeimg.com/6${
                    this.props.story.owner.id
                  }/120/people`}
                  alt=""
                />
              </Avatar>
            }
            title={"Story " + this.props.id}
            subheader={this.props.ownerName}
            action={
              <EditStoryDialog
                story={this.props.story}
                teamMembers={this.props.teamMembers}
                statusColumns={this.props.statusColumns}
                refreshUpdatedStory={this.props.refreshUpdatedStory}
              />
            }
          />
          <CardActionArea>
            <CardContent>
              <Typography>{this.props.name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(StoryCard);
