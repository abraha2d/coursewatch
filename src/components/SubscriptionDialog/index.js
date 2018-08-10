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

import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import Select from "react-virtualized-select";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
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
        this.setState({ suggestions: this.getSuggestions(this.state.course) });
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
        { course: this.state.courseId },
        { headers: { Authorization: `Bearer ${this.props.apiAccessToken}` } }
      );
    } else {
      req = axios.post(
        "/api/subscriptions",
        { course: this.state.courseId },
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
            <Select
              options={this.state.responses.courses}
              optionHeight={86}
              optionRenderer={({
                focusedOption,
                focusOption,
                option,
                selectValue,
                style
              }) => (
                <div style={style}>
                  <ListItem
                    selected={option === focusedOption}
                    onMouseOver={focusOption}
                    onClick={selectValue}
                  >
                    <ListItemText
                      primary={this.getCourseValue(option)}
                      secondary={option.title}
                    />
                    <ListItemSecondaryAction
                      className={classes.secondaryActions}
                    >
                      <Button
                        onClick={() =>
                          window.open(
                            `${
                              option.term.college.url
                            }/bwckschd.p_disp_detail_sched?term_in=${
                              option.term.yyyymm
                            }&crn_in=${option.crn}`
                          )
                        }
                      >
                        <Typography variant="headline">
                          {option.availability.remaining}/{
                            option.availability.capacity
                          }
                        </Typography>
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              )}
            />
            {/*renderInputComponent={inputProps => {
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
              }}*/}
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
