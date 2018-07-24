/**
 *
 * LoginPage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { push } from "connected-react-router/immutable";

import injectReducer from "utils/injectReducer";
import makeSelectAuth from "./selectors";
import reducer from "./reducer";

import LoginDialog from "components/LoginDialog";
import { setToken } from "./actions";

/* eslint-disable react/prefer-stateless-function */
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
  dispatch: PropTypes.func.isRequired,
  Auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  Auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: "auth", reducer });

export default compose(
  withReducer,
  withConnect
)(LoginPage);
