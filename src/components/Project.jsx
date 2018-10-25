import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import API_URL from "../ApiAdapter";
import Select from "react-select";

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
  }
});

class Project extends Component {
  state = {
    allUsers: [],
    members: [
      { value: 3, label: "Eljo George" },
      { value: 2, label: "Jerin George" }
    ]
  };

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
    this.fetchUsers();
  }

  fetchUsers = () => {
    var config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

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
      .post(`${API_URL}/graphql`, data, config)
      .then(res => {
        console.log(res.data.data.getUsers);
        this.setState({ allUsers: res.data.data.getUsers });
      })
      .catch(err => {
        console.log("GraphQL Error: " + err.message);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h5" variant="h5">
              Create/Update Project
            </Typography>
            {/* <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar> */}
            <form className={classes.form} onSubmit={this.login}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Project Name</InputLabel>
                <Input
                  id="project-name"
                  name="project-name"
                  autoFocus
                  onChange={this.handleChange("project-name")}
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
                  onChange={this.handleChange("project-description")}
                />
              </FormControl>
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
                  options={this.state.allUsers.map(user => ({
                    value: user.id,
                    label: user.name
                  }))}
                  value={this.state.members}
                  onChange={this.handleReactSelectChange("members")}
                  placeholder="Select Project Team Members"
                  isMulti
                  isClearable={false}
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
                Submit
              </Button>
            </form>
          </Paper>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Project);
