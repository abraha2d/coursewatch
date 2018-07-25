/**
 *
 * LogoutButton
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { Button } from "@material-ui/core";

import { loadAuth2 } from "./utils";

class LogoutButton extends React.PureComponent {
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
    window.gapi.auth2.getAuthInstance().signOut();
    this.props.onLogout();
  };

  render() {
    return (
      <Button onClick={this.handleLogout} {...this.props}>
        <Helmet>
          <script src="https://apis.google.com/js/platform.js?onload=handleGoogleInitLogoutButton" />
        </Helmet>
        Logout
      </Button>
    );
  }
}

LogoutButton.propTypes = {
  onLogout: PropTypes.func
};

export default LogoutButton;
