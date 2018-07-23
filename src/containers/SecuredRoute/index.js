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

import injectReducer from "utils/injectReducer";
import makeSelectSecuredRoute from "./selectors";
import reducer from "./reducer";

function SecuredRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        false ? (
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
  securedroute: makeSelectSecuredRoute()
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

const withReducer = injectReducer({ key: "securedroute", reducer });

export default compose(
  withReducer,
  withConnect
)(SecuredRoute);
