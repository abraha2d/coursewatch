/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import PropTypes from "prop-types";

import { Typography } from "@material-ui/core";

function NotFoundPage({ location }) {
  return (
    <div>
      <Typography variant="title">404: Page not found!</Typography>
      <Typography variant="subheading">{location.pathname}</Typography>
    </div>
  );
}

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired
};

export default NotFoundPage;
