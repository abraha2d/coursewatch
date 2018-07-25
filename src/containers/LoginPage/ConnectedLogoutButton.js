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
    const { dispatch, ...rest } = this.props;
    return (
      <LogoutButton onLogout={this.handleLogout} {...rest}>
        Logout
      </LogoutButton>
    );
  }
}

ConnectedLogoutButton.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(ConnectedLogoutButton);
