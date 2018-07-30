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

import makeSelectAuth from "containers/LoginPage/selectors";
import { setAuth } from "containers/LoginPage/actions";

function SecuredRoute({ component: Component, dispatch, auth, ...rest }) {
  let token = auth.token;
  if (!token) {
    token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (token) {
      dispatch(setAuth({ token, user }));
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth()
});

export default connect(mapStateToProps)(SecuredRoute);
