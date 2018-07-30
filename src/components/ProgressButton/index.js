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
    zIndex: -1
  }
});

class ProgressButton extends React.PureComponent {
  state = {
    loading: false
  };

  handleClick = () => {
    this.setState({ loading: true });
    this.props.onClick();
  };

  render() {
    // noinspection JSUnusedLocalSymbols
    const { classes, onClick, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <IconButton onClick={this.handleClick} {...rest}>
          {this.props.children}
        </IconButton>
        {this.state.loading && (
          <DelayedProgress circular size={48} className={classes.progress} />
        )}
      </div>
    );
  }
}

ProgressButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default withStyles(styles)(ProgressButton);
