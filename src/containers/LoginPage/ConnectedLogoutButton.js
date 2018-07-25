/**
 *
 * ConnectedLogoutButton
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import LogoutButton from "components/LoginDialog/LogoutButton";
import { setToken } from "./actions";

export class ConnectedLogoutButton extends React.PureComponent {
  handleLogout = () => {
    localStorage.removeItem("authToken");
    this.props.dispatch(setToken(null));
  };

  render() {
    return (
      <LogoutButton onLogout={this.handleLogout} {...this.props}>
        Logout
      </LogoutButton>
    );
  }
}

ConnectedLogoutButton.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(ConnectedLogoutButton);
