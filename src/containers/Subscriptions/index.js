/**
 *
 * Subscriptions
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

function Subscriptions() {
  return (
    <div>
      <Typography variant="title">Subscriptions</Typography>
      <List>
        <ListItem button>
          <ListItemText
            primary="ECE 4011 - Ece Culminating Design 1"
            secondary="CRN: 86217"
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="ECE 4180 - Embedded Systems Design"
            secondary="CRN: 87541"
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="ECE 3550 - Feedback Control Systems"
            secondary="CRN: 86084"
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="ID 2202 - Hist-Modern Indust Dsgn"
            secondary="CRN: 80719"
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="VIP 4602 - Vip Project Team: Sr II"
            secondary="CRN: 91557"
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add a course..." />
        </ListItem>
      </List>
    </div>
  );
}

Subscriptions.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  subscriptions: makeSelectSubscriptions()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: "subscriptions", reducer });

export default compose(
  withReducer,
  withConnect
)(Subscriptions);
