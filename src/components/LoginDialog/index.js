/**
 *
 * LoginDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import axios from "axios";

import logo from "images/logo.png";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  withMobileDialog,
  withStyles
} from "@material-ui/core";
import { loadAuth2 } from "./utils";

const styles = theme => ({
  headerImage: {
    width: "5em",
    height: "5em",
    display: "block",
    margin: "auto"
  },
  loginButton: {
    margin: theme.spacing.unit
  },
  googleLogin: {
    margin: 3 * theme.spacing.unit,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  orSpan: {
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 2 * theme.spacing.unit
  }
});

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false
    };
  }

  componentWillMount() {
    window.handleGoogleSignIn = this.handleGoogleSignIn;
    window.handleGoogleInitLoginDialog = this.handleGoogleInit;
  }

  componentWillUnmount() {
    delete window.handleGoogleSignIn;
    delete window.handleGoogleInitLoginDialog;
  }

  handleGoogleInit = () => {
    loadAuth2().then(
      () =>
        window.gapi.signin2.render("googleLogin", {
          onsuccess: this.handleGoogleSignIn
        }),
      error => console.error(error)
    );
  };

  handleChange = name => {
    return event => {
      this.setState({
        [name]: event.target.value,
        error: false
      });
    };
  };

  auth = (apiURL, access_token, sendAuth) =>
    axios
      .post(
        apiURL,
        { access_token: access_token },
        sendAuth
          ? {
              auth: {
                username: this.state.username,
                password: this.state.password
              }
            }
          : {}
      )
      .then(response => {
        this.props.onLogin(response.data);
      })
      .catch(error => this.setState({ error }));

  handleSignIn = event => {
    event.preventDefault();
    this.auth("/api/auth", this.props.apiAccessToken, true);
  };

  handleGoogleSignIn = googleUser => {
    this.auth("/api/auth/google", googleUser.getAuthResponse().id_token, true);
  };

  render() {
    return (
      <Dialog
        open
        fullScreen={this.props.fullScreen}
        aria-labelledby="form-dialog-title"
      >
        <Helmet>
          <script src="https://apis.google.com/js/platform.js?onload=handleGoogleInitLoginDialog" />
        </Helmet>
        <form onSubmit={this.handleSignIn}>
          <DialogTitle id="form-dialog-title">
            <img
              className={this.props.classes.headerImage}
              src={logo}
              alt="Coursewatch Login"
            />
          </DialogTitle>
          <DialogContent>
            <TextField
              id="username"
              label="Username"
              type="username"
              autoComplete="username"
              required
              autoFocus
              fullWidth
              margin="dense"
              value={this.state.username}
              onChange={this.handleChange("username")}
              error={this.state.error !== false}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              margin="dense"
              value={this.state.password}
              onChange={this.handleChange("password")}
              error={this.state.error !== false}
            />
            <div className={this.props.classes.orSpan}>– or –</div>
            <div id="googleLogin" className={this.props.classes.googleLogin} />
          </DialogContent>
          <DialogActions>
            <Button>Forgot Password?</Button>
            <Button
              className={this.props.classes.loginButton}
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  fullScreen: PropTypes.bool,
  apiAccessToken: PropTypes.string,
  onLogin: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(
  withMobileDialog()(LoginDialog)
);
