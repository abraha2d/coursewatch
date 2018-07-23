/**
 *
 * SecuredRoute
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { Redirect, Route } from "react-router-dom";

import makeSelectAuth from "../LoginPage/selectors";

function SecuredRoute({ component: Component, Auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.token ? (
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
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  Auth: makeSelectAuth()
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

export default compose(withConnect)(SecuredRoute);
