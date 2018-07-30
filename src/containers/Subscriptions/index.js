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

import DelayedProgress from "components/DelayedProgress";

import AddCourseDialog from "components/AddCourseDialog";
import EditCourseDialog from "components/EditCourseDialog";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

const styles = () => ({
  loadingProgress: {
    marginTop: "10px"
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
    loading: true,
    response: null,
    error: null,
    addCourse: false,
    editCourse: null
  };

  componentWillMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ error: null, loading: true });
    axios
      .get("/api/subscriptions", {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(response => {
        this.setState({ response, loading: false });
      })
      .catch(error => this.setState({ error }));
  };

  deleteCourse = id => {
    this.setState({ loading: true });
    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(() => {
        this.refresh();
      })
      .catch(error => this.setState({ error }));
  };

  openAddDialog = () => {
    this.setState({ addCourse: true });
  };

  handleAddDialogClose = response => {
    this.setState({ addCourse: false });
    if (response) {
      this.refresh();
    }
  };

  openEditDialog = course => () => {
    this.setState({ editCourse: course });
  };

  handleEditDialogClose = response => {
    this.setState({ editCourse: null });
    if (response) {
      this.refresh();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title">Subscriptions</Typography>
        {this.state.loading && (
          <DelayedProgress className={classes.loadingProgress} />
        )}
        {this.state.error && (
          <Paper className={classes.errorPaper}>
            <Typography className={classes.errorText} variant="subheading">
              {this.state.error.toString()}
            </Typography>
          </Paper>
        )}
        <List>
          {this.state.response &&
            this.state.response.data.map(course => (
              <ListItem
                button
                key={course.id}
                onClick={this.openEditDialog(course)}
              >
                <ListItemText
                  primary={course.title}
                  secondary={`CRN: ${course.crn} (Term: ${course.term})`}
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
            ))}
          <ListItem button onClick={this.openAddDialog}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add a course..." />
          </ListItem>
        </List>
        {this.state.addCourse && (
          <AddCourseDialog
            apiAccessToken={this.props.auth.token}
            onClose={this.handleAddDialogClose}
          />
        )}
        {this.state.editCourse != null && (
          <EditCourseDialog
            apiAccessToken={this.props.auth.token}
            onClose={this.handleEditDialogClose}
            course={this.state.editCourse}
          />
        )}
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
