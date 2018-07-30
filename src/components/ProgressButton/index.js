/**
 *
 * ProgressButton
 *
 */

import React from "react";
import PropTypes from "prop-types";

import { IconButton, withStyles } from "@material-ui/core";

import DelayedProgress from "components/DelayedProgress";

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1
  }
});

class ProgressButton extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillUnmount() {
    clearTimeout(this.delay);
  }

  handleClick = () => {
    this.setState({ loading: true });
    if (this.props.resetAfterOne) {
      this.delay = setTimeout(() => {
        this.setState({ loading: false });
      }, 1550);
    }
    this.props.onClick();
  };

  render() {
    // noinspection JSUnusedLocalSymbols
    const { classes, onClick, resetAfterOne, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <IconButton onClick={this.handleClick} {...rest}>
          {this.props.children}
        </IconButton>
        {this.state.loading && (
          <DelayedProgress
            circular
            variant="indeterminate"
            size={48}
            className={classes.progress}
          />
        )}
      </div>
    );
  }
}

ProgressButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  resetAfterOne: PropTypes.bool
};

export default withStyles(styles)(ProgressButton);
