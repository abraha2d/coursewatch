/**
 *
 * AddCourseDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  withMobileDialog,
  withStyles
} from "@material-ui/core";

import DelayedProgress from "components/DelayedProgress";

const styles = theme => ({
  errorPaper: {
    backgroundColor: "#EF5350",
    padding: `${theme.spacing.unit}px`,
    margin: `${3 * theme.spacing.unit}px`,
    marginBottom: 0
  },
  errorText: {
    color: "#FFFFFF"
  }
});

class AddCourseDialog extends React.PureComponent {
  state = {
    term: "201809",
    crn: "",
    loading: false,
    error: null,
    errors: {
      term: false,
      crn: false
    }
  };

  handleChange = name => event => {
    const value = event.target.value;
    this.setState(prevState => ({
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: false
      }
    }));
  };

  addCourse = event => {
    event.preventDefault();
    this.setState({ error: null, loading: true });
    axios
      .post(
        "/api/subscriptions",
        {
          term: this.state.term,
          crn: this.state.crn,
          title: `Sample Course (CRN: ${this.state.crn})`
        },
        {
          headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
        }
      )
      .then(response => {
        this.setState({ loading: false });
        this.props.onClose(response);
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={() => this.props.onClose()}
        fullScreen={this.props.fullScreen}
        aria-labelledby="add-dialog-title"
      >
        {this.state.loading && <DelayedProgress />}
        {this.state.error && (
          <Paper className={classes.errorPaper}>
            <Typography className={classes.errorText} variant="subheading">
              {this.state.error.toString()}
            </Typography>
          </Paper>
        )}
        <form onSubmit={this.addCourse}>
          <DialogTitle id="add-dialog-title">Add course</DialogTitle>
          <DialogContent>
            <TextField
              id="term"
              label="Term"
              required
              fullWidth
              margin="dense"
              value={this.state.term}
              onChange={this.handleChange("term")}
              error={this.state.errors.term !== false}
            />
            <TextField
              id="crn"
              label="CRN"
              required
              autoFocus
              fullWidth
              margin="dense"
              value={this.state.crn}
              onChange={this.handleChange("crn")}
              error={this.state.errors.crn !== false}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onClose()} color="primary">
              Cancel
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

AddCourseDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool,
  onClose: PropTypes.func,
  apiAccessToken: PropTypes.string
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(AddCourseDialog);
