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

function ProgressButton(props) {
  const { classes, onClick, loading, children, ...rest } = props;
  return (
    <div className={classes.wrapper}>
      <IconButton onClick={onClick} {...rest}>
        {children}
      </IconButton>
      {loading && (
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

ProgressButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(ProgressButton);
