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
  Paper,
  Typography
} from "@material-ui/core";

import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

import makeSelectAuth from "containers/LoginPage/selectors";
import AddCourseDialog from "components/AddCourseDialog";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

const styles = () => ({
  centerLoading: {
    textAlign: "center"
  },
  errorPaper: {
    backgroundColor: "#EF5350",
    marginTop: "10px",
    padding: "10px"
  },
  errorText: {
    color: "#FFFFFF"
  }
});

class Subscriptions extends React.PureComponent {
  state = {
    response: null,
    error: null,
    dialogOpen: false
  };

  componentWillMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ error: null });
    axios
      .get("/api/subscriptions", {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(response => {
        this.setState({ response });
      })
      .catch(error => this.setState({ error }));
  };

  deleteCourse = id => {
    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
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
        {this.state.error && (
          <Paper className={classes.errorPaper}>
            <Typography className={classes.errorText} variant="subheading">
              {this.state.error}
            </Typography>
          </Paper>
        )}
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
        <AddCourseDialog
          apiAccessToken={this.props.auth.token}
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

Subscriptions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  subscriptions: makeSelectSubscriptions(),
  auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: "subscriptions", reducer });

export default compose(
  withReducer,
  withConnect
)(withStyles(styles)(Subscriptions));
