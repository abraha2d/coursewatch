import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function SecuredRoute({ component: Component, ...rest }) {
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
