import React from 'react';
import PropTypes from 'prop-types';

import GoogleLogin from 'react-google-login';

import logo from 'images/logo.png';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  withMobileDialog,
  withStyles
} from '@material-ui/core';

const styles = theme => ({
  headerImage: {
    width: '5em',
    height: '5em',
    display: 'block',
    margin: 'auto'
  },
  loginButton: {
    margin: theme.spacing.unit
  }
});

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleSubmit() {}

  render() {
    return (
      <Dialog
        open
        fullScreen={this.props.fullScreen}
        aria-labelledby="form-dialog-title"
      >
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
            onChange={this.handleChange('username')}
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
            onChange={this.handleChange('password')}
          />
          <GoogleLogin clientId="988780152592-ccs5v79t0vuhvd0t1fhko53ugfmpheo1.apps.googleusercontent.com" />
        </DialogContent>
        <DialogActions>
          <Button>Forgot Password?</Button>
          <Button
            className={this.props.classes.loginButton}
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  fullScreen: PropTypes.bool
};

export default withStyles(styles)(withMobileDialog()(LoginDialog));
