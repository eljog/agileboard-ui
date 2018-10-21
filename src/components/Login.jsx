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
import LockIcon from "@material-ui/icons/LockOutlined";
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

class Login extends Component {
  state = {
    usernameOrEmail: "",
    password: "",
    error: ""
  };

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  login = event => {
    event.preventDefault();
    const bodyFormData = new FormData();
    bodyFormData.set("usernameOrEmail", this.state.usernameOrEmail);
    bodyFormData.set("password", this.state.password);

    axios
      .post(`${API_URL}/auth/signin`, bodyFormData)
      .then(res => {
        console.log("LoggedIn: " + res.data);
        this.props.setLogin({ status: true, token: "Bearer " + res.data });
      })
      .catch(err => {
        console.log("Login Failed: " + err.message);
        let errorMessage = err.message;
        if (err.response !== undefined) {
          errorMessage = err.response["data"]["message"];
        }
        this.setState({ error: "❌" + errorMessage });
      });
  };

  handleChange = field => event => {
    this.setState({
      [field]: event.target.value
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
              Simply Agile!
            </Typography>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <form className={classes.form} onSubmit={this.login}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">
                  Email Address or Username
                </InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.handleChange("usernameOrEmail")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handleChange("password")}
                />
              </FormControl>
              {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

              <span className={classes.error}>{this.state.error}</span>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
            </form>
          </Paper>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Login);
