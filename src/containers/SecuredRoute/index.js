/**
 *
 * SecuredRoute
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

import makeSelectAuth from "containers/LoginPage/selectors";
import { setToken } from "containers/LoginPage/actions";

function SecuredRoute({ component: Component, dispatch, Auth, ...rest }) {
  let token = Auth.token;
  if (!token) {
    token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setToken(token));
    }
  }
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

SecuredRoute.propTypes = {
  dispatch: PropTypes.func.isRequired,
  Auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  Auth: makeSelectAuth()
});

export default connect(mapStateToProps)(SecuredRoute);
