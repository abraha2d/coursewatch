/**
 *
 * LogoutButton
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { loadAuth2 } from "./utils";

class LogoutButton extends React.PureComponent {
  componentWillMount() {
    window.handleGoogleInitLogoutButton = this.handleGoogleInit;
  }

  componentWillUnmount() {
    delete window.handleGoogleInitLogoutButton;
  }

  handleGoogleInit = () => {
    loadAuth2();
  };

  handleLogout = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    this.props.onLogout();
  };

  render() {
    return (
      <div>
        <Helmet>
          <script src="https://apis.google.com/js/platform.js?onload=handleGoogleInitLogoutButton" />
        </Helmet>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

LogoutButton.propTypes = {
  onLogout: PropTypes.func
};

export default LogoutButton;
