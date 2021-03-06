/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from "react";
import { Switch, Route } from "react-router-dom";

import SecuredRoute from "containers/SecuredRoute";

import HomePage from "containers/HomePage";
import LoginPage from "containers/LoginPage";

export default function App() {
  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <SecuredRoute path="/" component={HomePage} />
    </Switch>
  );
}
