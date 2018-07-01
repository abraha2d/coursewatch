import React from 'react';
import PropTypes from 'prop-types';
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
          <img src="/static/images/logo.png" />
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
