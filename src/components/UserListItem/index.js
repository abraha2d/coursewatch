/**
 *
 * UserListItem
 *
 */

import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  withStyles
} from "@material-ui/core";

const styles = theme => ({
  userMenuItem: {
    padding: `${3 * theme.spacing.unit}px ${2 * theme.spacing.unit}px`
  }
});

function UserListItem({ classes, user, ...rest }) {
  return (
    <MenuItem className={classes.userMenuItem} {...rest}>
      <ListItemAvatar>
        <Avatar src={user.picture} />
      </ListItemAvatar>
      <ListItemText primary={user.name} secondary={user.email} />
    </MenuItem>
  );
}

UserListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object
};

export default withStyles(styles)(UserListItem);
