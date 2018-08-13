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
import axios from "axios";

import {
  Avatar,
  Button,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";

import makeSelectAuth from "containers/LoginPage/selectors";
import { setUser } from "containers/LoginPage/actions";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  centerAvatar: {
    width: "96px",
    height: "96px",
    alignSelf: "center"
  },
  content: {
    padding: `${theme.spacing.unit}px`
  },
  actions: {
    padding: `${theme.spacing.unit}px`,
    textAlign: "end"
  }
});

export class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: null, user: props.auth.user };
  }

  handleChange = name => event => {
    const value = event.target.value;
    this.setState(prevState => ({
      user: { ...prevState.user, [name]: value }
    }));
  };

  handleSave = event => {
    event.preventDefault();
    this.setState({ error: null, loading: true });
    axios
      .put(
        "/api/users/me",
        { ...this.state.user },
        { headers: { Authorization: `Bearer ${this.props.auth.token}` } }
      )
      .then(response => {
        this.setState({ loading: false });
        localStorage.setItem("authUser", JSON.stringify(response.data));
        this.props.dispatch(setUser(response.data));
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="title">Profile</Typography>
        <Avatar
          src={this.props.auth.user.picture}
          className={classes.centerAvatar}
        />
        <form onSubmit={this.handleSave}>
          <div className={classes.content}>
            <TextField
              label="Name"
              required
              fullWidth
              margin="dense"
              value={this.state.user.name}
              onChange={this.handleChange("name")}
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="dense"
              value={this.state.user.email}
              onChange={this.handleChange("email")}
            />
            <TextField
              label="Phone"
              type="tel"
              fullWidth
              margin="dense"
              value={this.state.user.tel}
              onChange={this.handleChange("tel")}
            />
          </div>
          <div className={classes.actions}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
