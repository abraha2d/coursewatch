/**
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router/immutable";

import { withStyles } from "@material-ui/core/styles";

import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";

import {
  Inbox as InboxIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";

import Subscriptions from "containers/Subscriptions";
import Settings from "containers/Settings";
import NotFoundPage from "containers/NotFoundPage";

import LogoutButton from "containers/LoginPage/ConnectedLogoutButton";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  logoutAlign: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class HomePage extends React.PureComponent {
  state = {
    drawerOpen: false
  };

  handleDrawerToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleNavigate = url => {
    return () => {
      this.props.dispatch(push(url));
    };
  };

  render() {
    const { classes } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <MenuList>
          <MenuItem
            onClick={this.handleNavigate("/")}
            selected={this.props.location.pathname === "/"}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" />
          </MenuItem>
          <MenuItem
            onClick={this.handleNavigate("/settings")}
            selected={this.props.location.pathname === "/settings"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
        </MenuList>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.navIconHide}
              color="inherit"
              onClick={this.handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="title" color="inherit">
              Coursewatch
            </Typography>

            <div className={classes.logoutAlign}>
              <LogoutButton variant="outlined" color="inherit" />
            </div>
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={this.state.drawerOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden smDown>
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={Subscriptions} />
            <Route exact path="/settings" component={Settings} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  let location = state.getIn(["router", "location"]).toJS();
  if (location.location) {
    location = location.location;
  }
  return { location };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(HomePage)
);
