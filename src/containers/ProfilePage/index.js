/**
 *
 * ProfilePage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import { Avatar, TextField, Typography, withStyles } from "@material-ui/core";

import makeSelectAuth from "containers/LoginPage/selectors";

const styles = () => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  centerAvatar: {
    width: "96px",
    height: "96px",
    alignSelf: "center"
  }
});

/* eslint-disable react/prefer-stateless-function */
export class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...props.auth.user };
  }

  handleChange = name => event => {
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="display1">Profile</Typography>
        <Avatar
          src={this.props.auth.user.picture}
          className={classes.centerAvatar}
        />
        <TextField
          label="Name"
          required
          fullWidth
          margin="dense"
          value={this.state.name}
          onChange={this.handleChange("name")}
        />
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="dense"
          value={this.state.email}
          onChange={this.handleChange("email")}
        />
      </div>
    );
  }
}

ProfilePage.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  withStyles(styles)
)(ProfilePage);
