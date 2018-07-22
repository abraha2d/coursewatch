import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import logo from 'images/logo.png';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
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
      username: '',
      password: '',
      error: false,
      showLoginMessage: false
    };
  }

  componentWillMount() {
    window['onSignIn'] = this.handleGSubmit;
  }

  componentWillUnmount() {
    delete window['onSignIn'];
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
        error: false
      });
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    axios
      .post(
        '/api/auth',
        {
          access_token: process.env.REACT_APP_API_MASTER_KEY
        },
        {
          auth: { username: this.state.username, password: this.state.password }
        }
      )
      .then(response => {
        this.setState({ showLoginMessage: true });
        console.log(response);
      })
      .catch(error => {
        this.setState({ error: true });
        console.error(error);
      });
  };

  handleGSubmit = (googleUser, ...rest) => {
    console.log(googleUser, rest);
    // axios
    //   .post(
    //     '/api/auth',
    //     {
    //       access_token: process.env.REACT_APP_API_MASTER_KEY
    //     },
    //     {
    //       auth: { username: this.state.username, password: this.state.password }
    //     }
    //   )
    //   .then(response => {
    //     this.setState({ showLoginMessage: true });
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     this.setState({ error: true });
    //     console.error(error);
    //   });
  };

  render() {
    return (
      <div>
        <Dialog
          open
          fullScreen={this.props.fullScreen}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this.handleSubmit}>
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
                error={this.state.error}
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
                error={this.state.error}
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
                type="submit"
              >
                Login
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={this.state.showLoginMessage}
          message="Authentication successful!"
        />
      </div>
    );
  }
}

LoginDialog.propTypes = {
  fullScreen: PropTypes.bool
};

export default withStyles(styles)(withMobileDialog()(LoginDialog));
