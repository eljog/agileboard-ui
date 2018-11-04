import React, { Component, Fragment } from "react";

import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10
  }
});
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { user: props.loginState.currentUser };
  }
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h5" variant="h5">
              {this.props.loginState.currentUser.name}
            </Typography>
            <Avatar className={classes.avatar}>
              <img
                // src={`https://placeimg.com/12${this.props.loginState.currentUser
                //   .id % 10}/120/people`}
                src={`https://api.adorable.io/avatars/80/${
                  this.props.loginState.currentUser.id
                }.png`}
                alt=""
              />
            </Avatar>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={this.props.loginState.currentUser.email}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="User Name"
                  secondary={this.props.loginState.currentUser.username}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Project"
                  secondary={
                    this.props.loginState.currentUser.project
                      ? this.props.loginState.currentUser.project.name
                      : "None"
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Profile);
