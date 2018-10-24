import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StoryBoardIcon from "@material-ui/icons/Dashboard";
import ProfileIcon from "@material-ui/icons/Person";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import ProjectIcon from "@material-ui/icons/NextWeek";
import AboutUsIcon from "@material-ui/icons/Info";

import StoryGrid from "./StoryGrid";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  }
});

class PersistentDrawer extends Component {
  state = {
    open: false,
    anchor: "left",
    currentPage: undefined
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  loadPage = page => {
    this.setState({ currentPage: page });
    this.handleDrawerClose();
  };

  pages = {
    storyGrid: {
      title: "Kanban Story Board",
      content: (
        <StoryGrid
          loginState={this.props.loginState}
          appendNewStory={this.props.appendNewStory}
          refreshUpdatedStory={this.props.refreshUpdatedStory}
          teamMembers={this.props.teamMembers}
          statusColumns={this.props.statusColumns}
          fetchStoriesForProject={this.props.fetchStoriesForProject}
          filterStoriesByStatus={this.props.filterStoriesByStatus}
        />
      )
    },
    about: {
      title: "About Us",
      content: <h5>We are a Simple free Agile Board!</h5>
    },
    profile: { title: "My Profile", content: <h5>My Profile!</h5> },
    project: { title: "My Project", content: <h5>My Project</h5> }
  };

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            key={"Story Board"}
            onClick={() =>
              this.props.loginState.currrentUser.project
                ? this.loadPage(this.pages.storyGrid)
                : this.loadPage(this.pages.project)
            }
          >
            <ListItemIcon>
              <StoryBoardIcon />
            </ListItemIcon>
            <ListItemText primary="Story Board" />
          </ListItem>
          <ListItem
            button
            key={"My Project"}
            onClick={() => this.loadPage(this.pages.project)}
          >
            <ListItemIcon>
              <ProjectIcon />
            </ListItemIcon>
            <ListItemText primary="My Project" />
          </ListItem>
          <ListItem
            button
            key={"My Profile"}
            onClick={() => this.loadPage(this.pages.profile)}
          >
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key={"Sign Out"} onClick={() => this.props.logout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key={"About"}
            onClick={() => this.loadPage(this.pages.about)}
          >
            <ListItemIcon>
              <AboutUsIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    );

    let before = drawer;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                {this.state.currentPage
                  ? this.state.currentPage.title
                  : "Simply Agile!"}
              </Typography>

              <div className={classes.grow} />
            </Toolbar>
          </AppBar>

          {before}
          <main
            className={classNames(
              classes.content,
              classes[`content-${anchor}`],
              {
                [classes.contentShift]: open,
                [classes[`contentShift-${anchor}`]]: open
              }
            )}
          >
            <div className={classes.drawerHeader} />

            {this.state.currentPage ? (
              this.state.currentPage.content
            ) : (
              <h3>Use the Menu</h3>
            )}
          </main>
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
