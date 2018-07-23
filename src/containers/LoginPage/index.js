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

import injectReducer from "utils/injectReducer";
import makeSelectLoginPage from "./selectors";
import reducer from "./reducer";
import LoginDialog from "../../components/LoginDialog";

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.PureComponent {
  handleLogin = token => {
    console.log(token);
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

const mapStateToProps = createStructuredSelector({
  loginpage: makeSelectLoginPage()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "loginPage", reducer });

export default compose(
  withReducer,
  withConnect
)(LoginPage);
