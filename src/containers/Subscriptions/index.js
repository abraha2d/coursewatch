/**
 *
 * Subscriptions
 *
 */

import AddSubscriptionDialog from "components/AddSubscriptionDialog";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";

import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";

import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

import makeSelectAuth from "containers/LoginPage/selectors";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

const styles = () => ({
  centerLoading: {
    textAlign: "center"
  }
});

class Subscriptions extends React.PureComponent {
  state = {
    response: null,
    error: false,
    dialogOpen: false
  };

  componentWillMount() {
    axios
      .get("/api/subscriptions/", {
        headers: { Authorization: `Bearer ${this.props.Auth.token}` }
      })
      .then(response => {
        this.setState({ response });
      })
      .catch(error => this.setState({ error }));
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title">Subscriptions</Typography>
        <List className={classes.centerLoading}>
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
          {this.state.response ? (
            this.state.response.data.map(course => (
              <ListItem button key={course.id}>
                <ListItemText
                  primary={course.name}
                  secondary={`Term/CRN: ${course.term}/${course.crn}`}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <CircularProgress />
          )}
          <ListItem button onClick={this.handleDialogOpen}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add a course..." />
          </ListItem>
        </List>
        <AddSubscriptionDialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

Subscriptions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  Auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  subscriptions: makeSelectSubscriptions(),
  Auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: "subscriptions", reducer });

export default compose(
  withReducer,
  withConnect
)(withStyles(styles)(Subscriptions));
