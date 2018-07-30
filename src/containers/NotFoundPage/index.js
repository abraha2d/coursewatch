/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";

import { Typography } from "@material-ui/core";

export default function NotFound() {
  return <Typography variant="title">404: Page not found!</Typography>;
}
