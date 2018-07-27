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
    this.refresh();
  }

  refresh = () => {
    axios
      .get("/api/subscriptions", {
        headers: { Authorization: `Bearer ${this.props.Auth.token}` }
      })
      .then(response => {
        this.setState({ response });
      })
      .catch(error => this.setState({ error }));
  };

  deleteCourse = id => {
    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${this.props.Auth.token}` }
      })
      .then(() => {
        this.refresh();
      })
      .catch(error => this.setState({ error }));
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = response => {
    this.setState({ dialogOpen: false });
    if (response) {
      this.refresh();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title">Subscriptions</Typography>
        <List className={classes.centerLoading}>
          {this.state.response ? (
            this.state.response.data.map(course => (
              <ListItem button key={course.id}>
                <ListItemText
                  primary={course.title}
                  secondary={`Term/CRN: ${course.term}/${course.crn}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => this.deleteCourse(course.id)}
                  >
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
          apiAccessToken={this.props.Auth.token}
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
