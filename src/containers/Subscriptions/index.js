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
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from "@material-ui/core";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from "@material-ui/icons";

import makeSelectAuth from "containers/LoginPage/selectors";

import DelayedProgress from "components/DelayedProgress";
import ProgressButton from "components/ProgressButton";

import AddCourseDialog from "components/AddCourseDialog";
import EditCourseDialog from "components/EditCourseDialog";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

const styles = () => ({
  headerDiv: {
    display: "flex",
    alignItems: "center"
  },
  loadingProgress: {
    marginTop: "10px"
  },
  errorPaper: {
    backgroundColor: "#EF5350",
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
        this.setState({ loading: false, response });
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  deleteCourse = id => {
    this.setState({ [`${id}-loading`]: true });
    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(() => {
        this.setState({ [`${id}-loading`]: undefined });
        this.refresh();
      })
      .catch(error => this.setState({ [`${id}-loading`]: undefined, error }));
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
        <div className={classes.headerDiv}>
          <Typography variant="title">Subscriptions</Typography>
          <ProgressButton onClick={this.refresh} loading={this.state.loading}>
            <RefreshIcon />
          </ProgressButton>
        </div>
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
                  <ProgressButton
                    aria-label="Delete"
                    onClick={() => this.deleteCourse(course.id)}
                    loading={this.state[`${course.id}-loading`]}
                  >
                    <DeleteIcon />
                  </ProgressButton>
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
