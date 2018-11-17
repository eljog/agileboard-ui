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
import Badge from "@material-ui/core/Badge";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  card: {
    maxWidth: "16vw",
    minWidth: "16vw",
    marginBottom: "1vh"
  },

  media: {
    objectFit: "cover"
  },

  avatar: {
    backgroundColor: "red"
  },

  margin: {},

  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },

  text: {
    wordWrap: "break-word"
  },

  badge: {
    top: 1,
    right: -15,
    // margin: theme.spacing.unit * -10,
    // The border color match the background color.
    border: `6px solid ${
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
    }`
  }
});

class StoryCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        {/* <Badge color="primary" badgeContent={4} className={classes.margin}> */}
        <Badge
          badgeContent={this.props.story.points}
          color="primary"
          classes={{ badge: classes.badge }}
        >
          <Card
            className={classes.card}
            draggable={true}
            onDragStart={ev => {
              ev.dataTransfer.setData(
                "story",
                JSON.stringify(this.props.story)
              );
            }}
          >
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  <img
                    // /src={`https://placeimg.com/12${this.props.story.owner.id %
                    //   10}/120/animals`}
                    src={`https://api.adorable.io/avatars/32/${
                      this.props.story.owner.id
                    }.png`}
                    alt=""
                  />
                </Avatar>
              }
              title={"Story " + this.props.id}
              subheader={
                // this.props.ownerName.substring(0, 8) &
                this.props.ownerName.length > 14
                  ? this.props.ownerName.substring(0, 12) + "..."
                  : this.props.ownerName
              }
              action={
                <EditStoryDialog
                  story={this.props.story}
                  teamMembers={this.props.teamMembers}
                  statusColumns={this.props.statusColumns}
                  refreshUpdatedStory={this.props.refreshUpdatedStory}
                  loginState={this.props.loginState}
                />
              }
            />
            <CardActionArea>
              <CardContent>
                <Typography align="justify" className={classes.text}>
                  {this.props.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Badge>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(StoryCard);
