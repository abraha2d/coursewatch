import React from 'react';
import PropTypes from 'prop-types';

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
  },
  googleLogin: {
    margin: 3 * theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  orSpan: {
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: 2 * theme.spacing.unit
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
          <div className={this.props.classes.orSpan}>– or –</div>
          <div
            className={`g-signin2 ${this.props.classes.googleLogin}`}
            data-onsuccess="onSignIn"
          />
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
