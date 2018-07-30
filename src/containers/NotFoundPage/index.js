/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

const mapStateToProps = state => {
  let location = state.getIn(["router", "location"]).toJS();
  if (location.location) {
    location = location.location;
  }
  return { location };
};

export default connect(mapStateToProps)(NotFoundPage);
