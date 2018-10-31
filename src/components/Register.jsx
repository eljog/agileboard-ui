import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import PenIcon from "@material-ui/icons/CreateOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import API_URL from "../ApiAdapter";

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
    marginTop: theme.spacing.unit * 8,
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

class Register extends Component {
  state = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: ""
  };

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  login = event => {
    event.preventDefault();
    if (!this.validatePassword()) return;
    const data = {};
    data.name = this.state.name;
    data.email = this.state.email;
    data.username = this.state.username;
    data.password = this.state.password;

    axios
      .post(`${API_URL}/auth/signup`, data)
      .then(res => {
        console.log(res.data);
        alert(res.data);
        this.props.showLogin();
      })
      .catch(err => {
        console.log("Signup Failed: " + err.message);
        const n = "\n";
        let errorMessage = err.message;
        if (err.response !== undefined) {
          // const errors = err.response["data"]["errors"];
          // if (errors !== undefined) {
          //   errorMessage = "Signup Failed\n";
          //   errors.map(error => {
          //     errorMessage =
          //       errorMessage +
          //       error.field +
          //       "- " +
          //       error.defaultMessage +
          //       ~{ n };
          //   });
          // } else {
          if (err.response["data"]["message"] != undefined) {
            errorMessage = err.response["data"]["message"];
          } else {
            errorMessage = err.response["data"];
          }

          // }
        }
        this.setState({ error: "❌" + errorMessage });
      });
  };

  handleChange = field => event => {
    var value = event.target.value;
    this.setState({
      [field]: value
    });
  };

  validatePassword = () => {
    if (
      this.state.password !== undefined &&
      this.state.password === this.state.confirmPassword
    ) {
      return true;
    }
    this.setState({ error: "Passwords do not match!" });
    return false;
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h5" variant="h5">
              Register
            </Typography>
            <Avatar className={classes.avatar}>
              <PenIcon />
            </Avatar>
            <form className={classes.form} onSubmit={this.login}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Name</InputLabel>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  inputProps={{ maxLength: 40, minLength: 4 }}
                  onChange={this.handleChange("name")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputProps={{ maxLength: 40, type: "email" }}
                  onChange={this.handleChange("email")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Username</InputLabel>
                <Input
                  id="username"
                  name="username"
                  inputProps={{ maxLength: 15, minLength: 3 }}
                  onChange={this.handleChange("username")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  inputProps={{ maxLength: 20, minLength: 3 }}
                  onChange={this.handleChange("password")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                <Input
                  name="password-confirm"
                  type="password"
                  id="password-confirm"
                  inputProps={{ maxLength: 20, minLength: 3 }}
                  onChange={this.handleChange("confirmPassword")}
                />
              </FormControl>
              {this.state.error ? (
                <span className={classes.error}>
                  <br />
                  {this.state.error}
                </span>
              ) : (
                React.Fragment
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Register
              </Button>
            </form>
            <br />
            <Button onClick={this.props.showLogin}>
              Already Registered? Login here!
            </Button>
          </Paper>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Register);
