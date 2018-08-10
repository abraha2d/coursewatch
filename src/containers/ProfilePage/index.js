/**
 *
 * ProfilePage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

/* eslint-disable react/prefer-stateless-function */
export class ProfilePage extends React.PureComponent {
  render() {
    return <div>THIS IS PROFILE PAGE!</div>;
  }
}

ProfilePage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const withConnect = connect();

export default compose(withConnect)(ProfilePage);
