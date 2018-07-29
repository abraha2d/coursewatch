/**
 *
 * EditCourseDialog
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

class EditCourseDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      term: props.course.term,
      crn: props.course.crn,
      title: props.course.title,
      errors: {
        term: false,
        crn: false,
        title: false
      }
    };
  }

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

  editCourse = event => {
    event.preventDefault();
    axios
      .put(
        `/api/subscriptions/${this.props.course.id}`,
        {
          term: this.state.term,
          crn: this.state.crn,
          title: this.state.title
        },
        {
          headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
        }
      )
      .then(response => {
        this.props.onClose(response);
      });
  };

  render() {
    return (
      <Dialog
        open
        onClose={() => this.props.onClose()}
        fullScreen={this.props.fullScreen}
        aria-labelledby="edit-dialog-title"
      >
        <form onSubmit={this.editCourse}>
          <DialogTitle id="edit-dialog-title">Edit course</DialogTitle>
          <DialogContent>
            <TextField
              id="term"
              label="Term"
              required
              autoFocus
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
              fullWidth
              margin="dense"
              value={this.state.crn}
              onChange={this.handleChange("crn")}
              error={this.state.errors.crn !== false}
            />
            <TextField
              id="title"
              label="Title"
              required
              fullWidth
              margin="dense"
              value={this.state.title}
              onChange={this.handleChange("title")}
              error={this.state.errors.title !== false}
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

EditCourseDialog.propTypes = {
  fullScreen: PropTypes.bool,
  onClose: PropTypes.func,
  apiAccessToken: PropTypes.string,
  course: PropTypes.object
};

export default withMobileDialog()(EditCourseDialog);
