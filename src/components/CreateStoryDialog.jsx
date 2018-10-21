import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CreateIcon from "@material-ui/icons/CreateRounded";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";
import { FormControl, Divider } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import API_URL from "../ApiAdapter";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  selectField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    display: "flex",
    minWidth: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  error: {
    color: "red"
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CreateStoryDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    open: false,
    storyForm: {},
    error: null
  };

  constructor(props) {
    super(props);
    console.log(JSON.stringify(props));
    const storyForm = {
      name: "",
      owner: `${this.props.loginState.currrentUser.id}`,
      details: "",
      status: "New",
      project: `${this.props.loginState.currrentUser.project.id}`,
      points: 0
    };
    this.state = { open: false, storyForm: storyForm };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      storyForm: {
        name: "",
        owner: `${this.props.loginState.currrentUser.id}`,
        details: "",
        status: "New",
        project: `${this.props.loginState.currrentUser.project.id}`,
        points: 0
      }
    });
  };

  handleChange = field => event => {
    const storyForm = this.state.storyForm;
    // Allow Only numbers for Story points
    if (field === "points") {
      event.target.value.replace(/[^0-9]/g, "");
    }
    storyForm[field] = event.target.value;
    this.setState({
      storyForm: storyForm
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    console.log(this.state.storyForm);

    const query = `mutation CreateStory($input: StoryInput!) {
        createStory(input: $input) {
          id
          name
          details
          status
          points
          owner {
            id
            name
          }
          project {
            id
            name
          }
        }
      }`;

    const variables = {
      input: {
        name: this.state.storyForm.name,
        details: this.state.storyForm.details,
        ownerId: this.state.storyForm.owner,
        status: this.state.storyForm.status,
        points: this.state.storyForm.points,
        projectId: this.state.storyForm.project
      }
    };

    let data = {
      query: query,
      variables: JSON.stringify(variables)
    };

    axios
      .post(`${API_URL}/graphql`, data, config)
      .then(res => {
        console.log("Story created: " + res.data.data.createStory);
        const story = res.data.data.createStory;
        if (story === null && res !== null) {
          this.setState({
            error: "❌ " + res["data"]["errors"][0]["exception"]["message"]
          });
        } else {
          this.props.appendNewStory(res.data.data.createStory);
          this.handleClose();
        }
      })
      .catch(err => {
        console.log("GraphQL Error while creating story: " + err.message);
        this.setState({
          error: "❌ " + err.message
        });
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <IconButton color="inherit">
          <CreateIcon onClick={this.handleClickOpen} />
        </IconButton>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                New Story
              </Typography>
              {/* <Button color="inherit" onClick={this.handleClose}>
                save
              </Button> */}
            </Toolbar>
          </AppBar>
          <form
            id="myForm"
            className={classes.container}
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <TextField
              fullWidth
              required
              id="story-name"
              label="Name"
              inputProps={{ maxLength: 250 }}
              className={classes.textField}
              value={this.state.storyForm.name}
              onChange={this.handleChange("name")}
              margin="normal"
            />
            <FormControl>
              <InputLabel className={classes.textField} htmlFor="story-owner">
                Owner
              </InputLabel>
              <Select
                required
                id="story-owner"
                className={classes.selectField}
                onChange={this.handleChange("owner")}
                value={this.state.storyForm.owner}
              >
                {this.props.teamMembers.map(member => {
                  console.log(member.name);
                  return (
                    <MenuItem
                      key={member.id}
                      value={member.id}
                      selected={member.id === this.state.storyForm.owner}
                    >
                      {member.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel className={classes.textField} htmlFor="story-status">
                Status
              </InputLabel>
              <Select
                required
                id="story-status"
                className={classes.selectField}
                onChange={this.handleChange("status")}
                value={this.state.storyForm.status}
              >
                {this.props.statusColumns.map(statusColumn => {
                  return (
                    <MenuItem
                      selected={
                        statusColumn.status === this.state.storyForm.status
                      }
                      key={statusColumn.status}
                      value={statusColumn.status}
                    >
                      {statusColumn.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              required
              id="story-points"
              label="Points"
              inputProps={{ maxLength: 3 }}
              className={classes.textField}
              value={this.state.storyForm.points}
              onChange={this.handleChange("points")}
            />
            <TextField
              fullWidth
              required
              multiline
              rows={6}
              maxrows={12}
              id="story-details"
              label="Details"
              className={classes.textField}
              value={this.state.storyForm.details}
              onChange={this.handleChange("details")}
              margin="normal"
            />
            <FormControl
              fullWidth
              error={true}
              component="fieldset"
              margin="dense"
            >
              <span className={classes.error}>{this.state.error}</span>
              {/* <FormHelperText>{this.state.error}</FormHelperText> */}
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.textField}
            >
              Create
            </Button>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CreateStoryDialog);
