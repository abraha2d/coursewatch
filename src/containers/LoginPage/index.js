/**
 *
 * LoginPage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { push } from "connected-react-router/immutable";

import LoginDialog from "components/LoginDialog";
import { setToken } from "./actions";

export class LoginPage extends React.PureComponent {
  handleLogin = token => {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    localStorage.setItem("authToken", token);
    this.props.dispatch(setToken(token));
    this.props.dispatch(push(from));
  };

  render() {
    return (
      <LoginDialog
        apiAccessToken={process.env.REACT_APP_API_MASTER_KEY}
        onLogin={this.handleLogin}
      />
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(LoginPage);
