/**
 *
 * AddCourseDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import axios from "axios";
import Autosuggest from "react-autosuggest";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
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
    suggestions: [],
    courseId: "",
    error: null,
    errors: {
      college: false,
      term: false,
      course: false
    }
  };

  handleChange = name => (event, nvm) => {
    const value = nvm ? nvm.newValue : event.target.value;
    this.setState(prevState => ({
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: false
      }
    }));
    if (name === "college") {
      this.setState({ term: "", course: "", courseId: "" });
      this.getTerms(value);
    } else if (name === "term") {
      this.setState({ course: "", courseId: "" });
      this.getCourses(value);
    }
  };

  getColleges = () => {
    this.setState(prevState => ({
      error: null,
      loading: true,
      responses: { ...prevState.responses, terms: null, courses: null },
      suggestions: []
    }));
    return axios
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
      responses: { ...prevState.responses, courses: null },
      suggestions: []
    }));
    return axios
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
        this.setState({ suggestions: this.getSuggestions(this.state.course) });
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  // noinspection JSUnresolvedVariable
  getCourseValue = course =>
    `${course.crn} - ${course.subject} ${course.number} ${course.section}`;

  getSuggestions = input =>
    this.state.responses.courses.filter(course => {
      return this.getCourseValue(course)
        .toLowerCase()
        .includes(input.toLowerCase());
    });

  addCourse = event => {
    event.preventDefault();
    if (this.state.courseId === "") {
      return;
    }
    this.setState({ error: null, loading: true });
    axios
      .post(
        "/api/subscriptions",
        { course: this.state.courseId },
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
              onChange={this.handleChange("college")}
              disabled={this.state.responses.colleges === null}
              error={this.state.errors.college !== false}
            >
              {this.state.responses.colleges &&
                this.state.responses.colleges.map(college => (
                  <MenuItem key={college.id} value={college.id}>
                    {college.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="Term"
              required
              fullWidth
              margin="dense"
              value={this.state.term}
              onChange={this.handleChange("term")}
              disabled={this.state.responses.terms === null}
              error={this.state.errors.term !== false}
            >
              {this.state.responses.terms &&
                this.state.responses.terms.map(term => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.name}
                  </MenuItem>
                ))}
            </TextField>
            <Autosuggest
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={({ value }) => {
                this.setState({
                  suggestions: this.getSuggestions(value)
                });
              }}
              onSuggestionsClearRequested={() => {}}
              getSuggestionValue={this.getCourseValue}
              renderSuggestion={(course, { query, isHighlighted }) => (
                <MenuItem selected={isHighlighted}>
                  <ListItemText
                    primary={this.getCourseValue(course)}
                    secondary={course.title}
                  />
                </MenuItem>
              )}
              inputProps={{
                value: this.state.course,
                onChange: this.handleChange("course")
              }}
              onSuggestionSelected={(event, { suggestion }) => {
                this.setState({ courseId: suggestion.id });
              }}
              alwaysRenderSuggestions
              highlightFirstSuggestion
              renderInputComponent={inputProps => {
                const { value, onChange, ...rest } = inputProps;
                return (
                  <TextField
                    label="Course"
                    required
                    fullWidth
                    margin="dense"
                    value={value}
                    onChange={onChange}
                    disabled={this.state.responses.courses === null}
                    error={this.state.errors.course !== false}
                    inputProps={rest}
                  />
                );
              }}
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
