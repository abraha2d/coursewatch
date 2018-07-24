/**
 *
 * SecuredRoute
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Redirect, Route } from "react-router-dom";

import makeSelectAuth from "../LoginPage/selectors";
import { setToken } from "../LoginPage/actions";

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
