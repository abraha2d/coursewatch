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

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from "@material-ui/icons";

import makeSelectAuth from "containers/LoginPage/selectors";

import ProgressButton from "components/ProgressButton";
import SubscriptionDialog from "components/SubscriptionDialog";

import injectReducer from "utils/injectReducer";
import makeSelectSubscriptions from "./selectors";
import reducer from "./reducer";

const styles = theme => ({
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
  },
  secondaryActions: {
    display: "flex"
  }
});

class Subscriptions extends React.PureComponent {
  state = {
    loading: true,
    deleteLoading: {},
    subscriptions: null,
    error: null,
    addSubscription: false,
    editSubscription: null
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
        this.setState({
          loading: false,
          deleteLoading: {},
          subscriptions: response.data
        });
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  deleteSubscription = id => () => {
    this.setState(prevState => ({
      error: null,
      deleteLoading: { ...prevState.deleteLoading, [id]: true }
    }));
    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(() => {
        this.refresh();
      })
      .catch(error =>
        this.setState(prevState => ({
          deleteLoading: { ...prevState.deleteLoading, [id]: false },
          error
        }))
      );
  };

  openAddDialog = () => {
    this.setState({ addSubscription: true });
  };

  handleAddDialogClose = response => {
    this.setState({ addSubscription: false });
    if (response) {
      this.refresh();
    }
  };

  openEditDialog = course => () => {
    this.setState({ editSubscription: course });
  };

  handleEditDialogClose = response => {
    this.setState({ editSubscription: null });
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
          {this.state.subscriptions &&
            this.state.subscriptions.map(subscription => (
              <ListItem
                button
                key={subscription.id}
                onClick={this.openEditDialog(subscription)}
              >
                <ListItemText
                  primary={`${subscription.course.crn} - ${
                    subscription.course.subject
                  } ${subscription.course.number} ${
                    subscription.course.section
                  }`}
                  secondary={subscription.course.title}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${
                          subscription.course.term.college.url
                        }/bwckschd.p_disp_detail_sched?term_in=${
                          subscription.course.term.yyyymm
                        }&crn_in=${subscription.course.crn}`
                      )
                    }
                  >
                    <Typography component="a" variant="headline">
                      {
                        (subscription.watchForWaitlist
                          ? subscription.course.waitlistAvailability
                          : subscription.course.availability
                        ).remaining
                      }/{
                        (subscription.watchForWaitlist
                          ? subscription.course.waitlistAvailability
                          : subscription.course.availability
                        ).capacity
                      }
                    </Typography>
                  </Button>
                  <ProgressButton
                    aria-label="Delete"
                    onClick={this.deleteSubscription(subscription.id)}
                    loading={this.state.deleteLoading[subscription.id]}
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
            <ListItemText primary="Add a subscription..." />
          </ListItem>
        </List>
        {this.state.addSubscription && (
          <SubscriptionDialog
            apiAccessToken={this.props.auth.token}
            onClose={this.handleAddDialogClose}
          />
        )}
        {this.state.editSubscription != null && (
          <SubscriptionDialog
            apiAccessToken={this.props.auth.token}
            onClose={this.handleEditDialogClose}
            subscription={this.state.editSubscription}
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
  withConnect,
  withStyles(styles)
)(Subscriptions);
