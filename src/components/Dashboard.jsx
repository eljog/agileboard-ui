import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import StoryStatusBar from "./charts/StoryStatusBar";
import StoryDistributionPie from "./charts/StoryDistributionPie";
import StoryStatusTable from "./charts/StoryStatusTable";

const styles = theme => ({
  barWrapper: {
    height: "40vh"
    // width: "40%",
    // float: "right"
  },
  barWrapperLeft: {
    // height: 500
    // width: "40%",
    // float: "left"
  },
  root: {
    flexGrow: 1,
    width: "100%"
    // minHeight: "100vh"
  },
  tableGrid: {
    flexGrow: 1,
    width: "89%",
    marginLeft: "5%"
  },
  column: {
    width: "45%"
  },
  paper: {
    minWidth: "100%",
    backgroundColor: "white"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

class Dashboard extends Component {
  state = {};
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
          <Grid key="grid1" className={classes.column} item>
            <Paper className={classes.paper}>
              <Typography
                gutterBottom
                variant="h6"
                align="center"
                component="h2"
              >
                Work Distribution
              </Typography>
              <div className={classes.barWrapper}>
                <StoryDistributionPie loginState={this.props.loginState} />
              </div>
            </Paper>
          </Grid>
          <Grid key="grid2" className={classes.column} item>
            <Paper className={classes.paper}>
              <Typography
                gutterBottom
                variant="h6"
                align="center"
                component="h2"
              >
                Work Progress
              </Typography>
              <div className={classes.barWrapper}>
                <StoryStatusBar loginState={this.props.loginState} />
              </div>
            </Paper>
          </Grid>
        </Grid>
        <br />

        <Grid
          container
          className={classes.tableGrid}
          spacing={16}
          justify="center"
          wrap="nowrap"
        >
          <Paper className={classes.paper}>
            {/* <Typography gutterBottom variant="h6" align="center" component="h2">
              Chart 1
            </Typography> */}
            {/* <Paper className={classes.root}> */}
            <StoryStatusTable loginState={this.props.loginState} />
          </Paper>
          {/* </Paper> */}
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
