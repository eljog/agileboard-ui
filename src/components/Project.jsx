import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";

import axios from "axios";
import Select from "react-select";

import API_URL from "../ApiAdapter";
import { SnackbarContent } from "@material-ui/core";

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
      width: "75%",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },

  error: {
    color: "red"
  },
  table: {
    minWidth: 700
  },
  snackbarSuccess: {
    backgroundColor: green[700],
    opacity: 1,
    marginRight: theme.spacing.unit
  },
  snackbarError: {
    backgroundColor: theme.palette.error.dark,
    opacity: 1,
    marginRight: theme.spacing.unit
  }
});

class Project extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      members: props.teamMembers(),
      newMembers: [],
      possibleMembers: [],
      hasProject: props.getProject() ? true : false,
      projectName: props.getProject() ? props.getProject().name : "",
      projectDescription: props.getProject()
        ? props.getProject().description
        : "",
      open: true,
      message: {
        show: false,
        text: "This is a message",
        type: "Error"
      }
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  handleReactSelectChange = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleChange = field => event => {
    var value = event.target.value;
    if (field == "remember") {
      value = event.target.checked;
    }
    this.setState({
      [field]: value
    });
  };

  componentDidMount() {
    this.fetchUsersWithoutProject();
  }

  closeSnackBar = () => {
    const message = this.state.message;
    message.show = false;
    this.setState({ message: message });
  };

  fetchUsersWithoutProject = () => {
    this.setState({ possibleMembers: [] });

    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    const query = `query { 
      getUsersWithoutProject {
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
        console.log(res.data.data.getUsersWithoutProject);
        this.setState({
          possibleMembers: res.data.data.getUsersWithoutProject
        });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
  };

  saveProject = e => {
    e.preventDefault();

    if (this.state.hasProject) {
      this.updateProject();
    } else {
      this.createProject();
    }
  };

  createProject = () => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    console.log("Project::createProject");

    const query = `mutation CreateProject($input: ProjectInput!) {
        createProject(input: $input) {
          id
          name
          description
          createdOn
          createdBy {
            id
            name
          }
        }
      }`;

    const variables = {
      input: {
        name: this.state.projectName,
        description: this.state.projectDescription
      }
    };

    let data = {
      query: query,
      variables: JSON.stringify(variables)
    };

    axios
      .post(`${API_URL}/graphql`, data, config)
      .then(res => {
        if (res.data.errors !== undefined) {
          this.setState({
            message: {
              text: res["data"]["errors"][0]["message"],
              type: "Error",
              show: true
            }
          });
        } else if (res.data.data !== undefined) {
          console.log(
            "Project created: " + JSON.stringify(res.data.data.createProject)
          );
          this.setState({
            hasProject: true,
            message: {
              text:
                "Project Successfully created with ID: " +
                res.data.data.createProject.id,
              type: "Success",
              show: true
            }
          });

          this.refreshProjectInState(res.data.data.createProject);
        }
      })
      .catch(err => {
        console.log("GraphQL Error while creating Project: " + err.message);
        this.setState({
          message: {
            text: err.message,
            type: "Error",
            show: true
          }
        });
      });
  };

  updateProject = () => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    console.log("Project::createProject");

    const query = `mutation UpdateProject($input: ProjectInput!) {
      updateProject(input: $input) {
          id
          name
          description
          createdOn
          createdBy {
            id
            name
          }
        }
      }`;

    const variables = {
      input: {
        id: this.props.loginState.project.id,
        name: this.state.projectName,
        description: this.state.projectDescription
      }
    };

    let data = {
      query: query,
      variables: JSON.stringify(variables)
    };

    axios
      .post(`${API_URL}/graphql`, data, config)
      .then(res => {
        if (res.data.errors !== undefined) {
          this.setState({
            message: {
              text: res["data"]["errors"][0]["message"],
              type: "Error",
              show: true
            }
          });
        } else if (res.data.data !== undefined) {
          console.log(
            "Project updated: " + JSON.stringify(res.data.data.updateProject)
          );
          this.setState({
            hasProject: true,
            message: {
              text: "Project Successfully updated!",
              type: "Success",
              show: true
            }
          });
          this.refreshProjectInState(res.data.data.updateProject);
        }
      })
      .catch(err => {
        console.log("GraphQL Error while updating Project: " + err.message);
        this.setState({
          message: {
            text: err.message,
            type: "Error",
            show: true
          }
        });
      });
  };

  addProjectMember = () => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    console.log("Project::addProjectMember");
    const query = `mutation AddProjectToUser($projectId: Int, $userId: Int) {
      addProjectToUser(projectId:$projectId, userId: $userId) {
        id
        name
        project {
          id
          name
        }
      }
    }
    `;

    this.state.newMembers.map(member => {
      const variables = {
        projectId: this.props.getProject().id,
        userId: member.value
      };

      let data = {
        query: query,
        variables: JSON.stringify(variables)
      };

      axios
        .post(`${API_URL}/graphql`, data, config)
        .then(res => {
          if (res.data.errors !== undefined) {
            console.log(res["data"]["errors"][0]["message"]);
          } else if (res.data.data !== undefined) {
            console.log(
              "Member added: " + JSON.stringify(res.data.data.addProjectToUser)
            );
            this.refreshProjectInState(this.props.getProject());
            setTimeout(() => {
              this.setState({
                members: this.props.teamMembers(),
                newMembers: []
              });
            }, 1000);
          }
        })
        .catch(err => {
          console.log(
            "GraphQL Error while adding project member: " + err.message
          );
        });
    });
  };

  refreshProjectInState = project => {
    this.props.setUserAndProject(this.props.loginState);
    this.props.fetchProjectMembers(project);
    this.fetchUsersWithoutProject();
  };

  addMember = e => {
    e.preventDefault();
    this.addProjectMember();
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h5" variant="h5">
              {this.state.hasProject ? "Update" : "Create"} Project
            </Typography>

            <form className={classes.form} onSubmit={this.saveProject}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Project Name</InputLabel>
                <Input
                  id="project-name"
                  name="project-name"
                  value={this.state.projectName}
                  autoFocus
                  onChange={this.handleChange("projectName")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="project-description">
                  Description
                </InputLabel>
                <Input
                  multiline
                  rows={5}
                  name="project-description"
                  id="project-description"
                  value={this.state.projectDescription}
                  onChange={this.handleChange("projectDescription")}
                />
              </FormControl>

              <span className={classes.error}>{this.state.error}</span>

              <Button
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {this.state.hasProject ? "Update" : "Create"}
              </Button>
            </form>
          </Paper>
          <br />

          {this.state.hasProject && (
            <Paper className={classes.paper}>
              <Typography component="h5" variant="h5">
                Manage Members
              </Typography>
              <form onSubmit={this.addMember}>
                <Paper>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell component="th">Current Members</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.members.map(member => {
                        return (
                          <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel
                    className={classes.textField}
                    htmlFor="project-members"
                  >
                    Owner
                  </InputLabel>
                  <Select
                    className={classes.textField}
                    id="project-members"
                    textFieldProps={{
                      label: "Members",
                      InputLabelProps: {
                        shrink: true
                      }
                    }}
                    options={this.state.possibleMembers.map(user => ({
                      value: user.id,
                      label: user.name
                    }))}
                    value={this.state.newMembers}
                    onChange={this.handleReactSelectChange("newMembers")}
                    placeholder="Add more Team Members"
                    isMulti
                    isClearable={false}
                  />
                </FormControl>
                {this.state.newMembers.length > 0 && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Add
                  </Button>
                )}
              </form>
            </Paper>
          )}

          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            open={this.state.message.show}
            autoHideDuration={5000}
            onClose={this.closeSnackBar}
          >
            <SnackbarContent
              className={classes[`snackbar${this.state.message.type}`]}
              aria-describedby="client-snackbar"
              message={<span id="message-id">{this.state.message.text}</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={() => this.closeSnackBar()}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]}
            />
          </Snackbar>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Project);
