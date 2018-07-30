/**
 *
 * LogoutButton
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { Button, withStyles } from "@material-ui/core";

import DelayedProgress from "components/DelayedProgress";

import { loadAuth2 } from "./utils";

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  },
  progress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -15,
    marginLeft: -15
  }
});

class LogoutButton extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    window.handleGoogleInitLogoutButton = this.handleGoogleInit;
  }

  componentWillUnmount() {
    delete window.handleGoogleInitLogoutButton;
  }

  handleGoogleInit = () => {
    loadAuth2().then(() => {}, object => console.error(object.error));
  };

  handleLogout = () => {
    this.setState({ loading: true });
    window.gapi.auth2.getAuthInstance().signOut();
    this.props.onLogout();
  };

  render() {
    const { classes, onLogout, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <Helmet>
          <script src="https://apis.google.com/js/platform.js?onload=handleGoogleInitLogoutButton" />
        </Helmet>
        <Button
          disabled={this.state.loading}
          onClick={this.handleLogout}
          {...rest}
        >
          Logout
        </Button>
        {this.state.loading && (
          <DelayedProgress circular size={30} className={classes.progress} />
        )}
      </div>
    );
  }
}

LogoutButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogout: PropTypes.func
};

export default withStyles(styles)(LogoutButton);
