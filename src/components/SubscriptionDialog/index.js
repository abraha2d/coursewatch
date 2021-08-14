/**
 *
 * SubscriptionDialog
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import axios from "axios";
import Autosuggest from "react-autosuggest";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  ListItemSecondaryAction,
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

class SubscriptionDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    const { subscription } = props;
    this.state = {
      college: subscription ? subscription.course.term.college.id : "",
      term: subscription ? subscription.course.term.id : "",
      course: subscription ? this.getCourseValue(subscription.course) : "",
      courseId: subscription ? subscription.course.id : "",
      watchForWaitlist: subscription ? subscription.watchForWaitlist : false,
      loading: false,
      responses: {
        colleges: null,
        terms: null,
        courses: null
      },
      suggestions: [],
      error: null,
      errors: {
        college: false,
        term: false,
        course: false
      }
    };
  }

  componentWillMount() {
    this.getColleges()
      .then(() => this.getTerms(this.state.college))
      .then(() => this.getCourses(this.state.term));
  }

  handleChange = name => (event, nvm) => {
    const value =
      name === "watchForWaitlist"
        ? event.target.checked
        : nvm
          ? nvm.newValue
          : event.target.value;
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
    } else if (name === "course") {
      this.setState({ courseId: "" });
    }
  };

  getColleges = () => {
    this.setState({
      error: null,
      loading: true,
      responses: { colleges: null, terms: null, courses: null },
      suggestions: []
    });
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
    if (college === "") return;
    this.setState(prevState => ({
      error: null,
      loading: true,
      responses: { ...prevState.responses, terms: null, courses: null },
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
    if (term === "") return;
    this.setState({
      error: null,
      loading: true,
      suggestions: []
    });
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

  addCourse = crn => {
    this.setState({ error: null, loading: true, suggestions: [] });
    return axios
      .post(
        "/api/courses",
        { term: this.state.term, crn },
        { headers: { Authorization: `Bearer ${this.props.apiAccessToken}` } }
      )
      .then(() => {
        this.setState({ loading: false });
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

  doSubscription = event => {
    event.preventDefault();
    if (this.state.courseId === "") {
      return;
    }
    this.setState({ error: null, loading: true });
    let req = null;
    if (this.props.subscription) {
      req = axios.put(
        `/api/subscriptions/${this.props.subscription.id}`,
        {
          course: this.state.courseId,
          watchForWaitlist: this.state.watchForWaitlist
        },
        { headers: { Authorization: `Bearer ${this.props.apiAccessToken}` } }
      );
    } else {
      req = axios.post(
        "/api/subscriptions",
        {
          course: this.state.courseId,
          watchForWaitlist: this.state.watchForWaitlist
        },
        { headers: { Authorization: `Bearer ${this.props.apiAccessToken}` } }
      );
    }
    req
      .then(response => {
        this.setState({ loading: false });
        this.props.onClose(response);
      })
      .catch(error => this.setState({ loading: false, error }));
  };

  render() {
    const { classes, subscription } = this.props;
    // noinspection JSUnresolvedVariable
    return (
      <Dialog
        open
        onClose={() => this.props.onClose()}
        fullScreen={this.props.fullScreen}
        aria-labelledby="dialog-title"
      >
        {this.state.loading && <DelayedProgress />}
        {this.state.error && (
          <Paper className={classes.errorPaper}>
            <Typography className={classes.errorText} variant="subheading">
              {this.state.error.toString()}
            </Typography>
          </Paper>
        )}
        <form onSubmit={this.doSubscription}>
          <DialogTitle id="dialog-title">
            {subscription ? "Edit" : "Add"} subscription
          </DialogTitle>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.watchForWaitlist}
                  onChange={this.handleChange("watchForWaitlist")}
                />
              }
              label="Watch for waitlist seats?"
            />
            <Autosuggest
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={({ value }) => {
                const suggestions = this.getSuggestions(value);
                this.setState({ suggestions });
                if (
                  suggestions.length === 0 &&
                  value.length === 5 &&
                  Number(value).toString() === value
                ) {
                  this.addCourse(value).then(() => {
                    this.getCourses(this.state.term);
                  });
                }
              }}
              onSuggestionsClearRequested={() => {
                this.setState({ suggestions: [] });
              }}
              getSuggestionValue={this.getCourseValue}
              renderSuggestion={(course, { query, isHighlighted }) => (
                <MenuItem selected={isHighlighted}>
                  <ListItemText
                    primary={this.getCourseValue(course)}
                    secondary={course.title}
                  />
                  <ListItemSecondaryAction className={classes.secondaryActions}>
                    <Button
                      onClick={() =>
                        window.open(
                          `${
                            course.term.college.url
                          }/bwckschd.p_disp_detail_sched?term_in=${
                            course.term.yyyymm
                          }&crn_in=${course.crn}`
                        )
                      }
                    >
                      <Typography variant="headline">
                        {
                          (this.state.watchForWaitlist
                            ? course.waitlistAvailability
                            : course.availability
                          ).remaining
                        }/{
                          (this.state.watchForWaitlist
                            ? course.waitlistAvailability
                            : course.availability
                          ).capacity
                        }
                      </Typography>
                    </Button>
                  </ListItemSecondaryAction>
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
                    helperText="Type CRN to import course from Banner"
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

SubscriptionDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool,
  onClose: PropTypes.func,
  apiAccessToken: PropTypes.string,
  subscription: PropTypes.object
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(SubscriptionDialog);
