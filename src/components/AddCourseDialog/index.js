/**
 *
 * AddCourseDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
  withMobileDialog,
  withStyles
} from "@material-ui/core";

import DelayedProgress from "components/DelayedProgress";

const styles = theme => ({
  errorPaper: {
    backgroundColor: "#EF5350",
    padding: `${theme.spacing.unit}px`,
    margin: `${3 * theme.spacing.unit}px`,
    marginBottom: 0
  },
  errorText: {
    color: "#FFFFFF"
  }
});

class AddCourseDialog extends React.PureComponent {
  state = {
    college: "",
    term: "",
    course: "",
    loading: false,
    responses: {
      colleges: null,
      terms: null,
      courses: null
    },
    error: null,
    errors: {
      college: false,
      term: false,
      course: false
    }
  };

  handleChange = name => value => {
    this.setState(prevState => ({
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: false
      }
    }));
    if (name === "college") {
      this.getTerms(value);
    } else if (name === "term") {
      this.getCourses(value);
    }
  };

  getColleges = () => {
    this.setState(prevState => ({
      error: null,
      loading: true,
      responses: { ...prevState.responses, terms: null, courses: null }
    }));
    axios
      .get("/api/colleges", {
        headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
      })
      .then(response => {
        this.setState(prevState => ({
          loading: false,
          responses: { ...prevState.responses, colleges: response.data }
        }));
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  getTerms = college => {
    this.setState(prevState => ({
      error: null,
      loading: true,
      responses: { ...prevState.responses, courses: null }
    }));
    axios
      .get(`/api/terms?college=${college}`, {
        headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
      })
      .then(response => {
        this.setState(prevState => ({
          loading: false,
          responses: { ...prevState.responses, terms: response.data }
        }));
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  getCourses = term => {
    this.setState({ error: null, loading: true });
    return axios
      .get(`/api/courses?term=${term}`, {
        headers: { Authorization: `Bearer ${this.props.apiAccessToken}` }
      })
      .then(response => {
        this.setState(prevState => ({
          loading: false,
          responses: { ...prevState.responses, courses: response.data }
        }));
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  addCourse = event => {
    event.preventDefault();
    this.setState({ error: null, loading: true });
    axios
      .post(
        "/api/subscriptions",
        { course: this.state.course },
        { headers: { Authorization: `Bearer ${this.props.apiAccessToken}` } }
      )
      .then(response => {
        this.setState({ loading: false });
        this.props.onClose(response);
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  componentWillMount() {
    this.getColleges();
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={() => this.props.onClose()}
        fullScreen={this.props.fullScreen}
        aria-labelledby="add-dialog-title"
      >
        {this.state.loading && <DelayedProgress />}
        {this.state.error && (
          <Paper className={classes.errorPaper}>
            <Typography className={classes.errorText} variant="subheading">
              {this.state.error.toString()}
            </Typography>
          </Paper>
        )}
        <form onSubmit={this.addCourse}>
          <DialogTitle id="add-dialog-title">Add course</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="College"
              required
              fullWidth
              margin="dense"
              value={this.state.college}
              onChange={event =>
                this.handleChange("college")(event.target.value)
              }
              disabled={this.state.responses.colleges === null}
              error={this.state.errors.college !== false}
            >
              {this.state.responses.colleges &&
                this.state.responses.colleges.map(college => (
                  <MenuItem value={college.id}>{college.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="Term"
              required
              fullWidth
              margin="dense"
              value={this.state.term}
              onChange={event => this.handleChange("term")(event.target.value)}
              disabled={this.state.responses.terms === null}
              error={this.state.errors.term !== false}
            >
              {this.state.responses.terms &&
                this.state.responses.terms.map(term => (
                  <MenuItem value={term.id}>{term.name}</MenuItem>
                ))}
            </TextField>
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

AddCourseDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool,
  onClose: PropTypes.func,
  apiAccessToken: PropTypes.string
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(AddCourseDialog);
