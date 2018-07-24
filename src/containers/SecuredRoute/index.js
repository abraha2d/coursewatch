/**
 *
 * SecuredRoute
 *
 */

import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Redirect, Route } from "react-router-dom";

import makeSelectAuth from "../LoginPage/selectors";
import PropTypes from "prop-types";
import { HomePage } from "../HomePage";

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

HomePage.propTypes = {
  Auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  Auth: makeSelectAuth()
});

export default connect(mapStateToProps)(SecuredRoute);
