/**
 *
 * DelayedProgress
 *
 */

import React from "react";
import PropTypes from "prop-types";

import { LinearProgress, CircularProgress } from "@material-ui/core";

class DelayedProgress extends React.PureComponent {
  state = {
    showProgress: false
  };

  componentWillMount() {
    this.delay = setTimeout(
      () => this.setState({ showProgress: true }),
      this.props.delay
    );
  }

  componentWillUnmount() {
    clearTimeout(this.delay);
  }

  render() {
    const { circular, ...rest } = this.props;
    return (
      this.state.showProgress &&
      (circular ? <CircularProgress {...rest} /> : <LinearProgress {...rest} />)
    );
  }
}

DelayedProgress.propTypes = {
  circular: PropTypes.bool,
  delay: PropTypes.number
};

DelayedProgress.defaultProps = {
  delay: 100
};

export default DelayedProgress;
