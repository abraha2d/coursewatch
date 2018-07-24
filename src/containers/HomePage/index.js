/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setToken } from "../LoginPage/actions";

export class HomePage extends React.PureComponent {
  handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut(); //eslint-disable-line no-undef
    this.props.dispatch(setToken(null));
  };

  render() {
    return (
      <div>
        <h1>This is HomePage component!</h1>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(HomePage);
