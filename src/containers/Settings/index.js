/**
 *
 * Settings
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography
} from "@material-ui/core";

import {
  Wifi as WifiIcon,
  Bluetooth as BluetoothIcon
} from "@material-ui/icons";

import injectReducer from "utils/injectReducer";
import makeSelectSettings from "./selectors";
import reducer from "./reducer";

class Settings extends React.PureComponent {
  state = {
    checked: ["wifi"]
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  render() {
    return (
      <div>
        <Typography variant="title">Settings</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText primary="Wi-Fi" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle("wifi")}
                checked={this.state.checked.indexOf("wifi") !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText primary="Bluetooth" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle("bluetooth")}
                checked={this.state.checked.indexOf("bluetooth") !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: "settings", reducer });

export default compose(
  withReducer,
  withConnect
)(Settings);
