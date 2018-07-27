/**
 *
 * AddSubscriptionDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  withMobileDialog
} from "@material-ui/core";

class AddSubscriptionDialog extends React.PureComponent {
  state = {
    term: "201809",
    crn: "",
    errors: {
      term: false,
      crn: false
    }
  };

  handleChange = name => {
    return event => {
      this.setState({
        [name]: event.target.value,
        errors: {
          ...this.state.errors,
          [name]: false
        }
      });
    };
  };

  addCourse = event => {
    event.preventDefault();
    axios
      .post(
        "/api/subscriptions",
        {
          crn: this.state.crn,
          term: this.state.term,
          title: `Sample Course (CRN: ${this.state.crn})`
        },
        {
          headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
        }
      )
      .then(this.props.onClose);
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onClose()}
        fullScreen={this.props.fullScreen}
        aria-labelledby="add-dialog-title"
      >
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

AddSubscriptionDialog.propTypes = {
  fullScreen: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  apiAccessToken: PropTypes.string
};

export default withMobileDialog()(AddSubscriptionDialog);
