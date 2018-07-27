/**
 *
 * AddSubscriptionDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";

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
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="add-dialog-title"
      >
        <DialogTitle id="add-dialog-title">Add subscription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="term"
            label="Term"
            defaultValue="201809"
            fullWidth
          />
          <TextField autoFocus margin="dense" id="crn" label="CRN" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.onClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddSubscriptionDialog.propTypes = {
  fullScreen: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default withMobileDialog()(AddSubscriptionDialog);
