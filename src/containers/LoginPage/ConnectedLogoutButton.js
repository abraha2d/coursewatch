/**
 *
 * ConnectedLogoutButton
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import LogoutButton from "components/LoginDialog/LogoutButton";
import { setAuth } from "./actions";

export class ConnectedLogoutButton extends React.PureComponent {
  handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    this.props.dispatch(setAuth({ token: null, user: null }));
  };

  render() {
    // noinspection JSUnusedLocalSymbols
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
