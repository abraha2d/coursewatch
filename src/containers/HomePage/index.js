/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  Hidden,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Snackbar,
  Button,
  Avatar
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  Inbox as InboxIcon,
  Drafts as DraftsIcon,
  Star as StarIcon,
  Send as SendIcon,
  Mail as MailIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Add as AddIcon,
  Folder as FolderIcon
} from "@material-ui/icons";

import LogoutButton from "containers/LoginPage/ConnectedLogoutButton";

const drawerWidth = 240;

const mailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Starred" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Send mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItem>
  </div>
);

const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem>
  </div>
);

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
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  fabMoveUp: {
    transform: "translate3d(0, -46px, 0)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut
    })
  },
  fabMoveDown: {
    transform: "translate3d(0, 0, 0)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  snackbar: {
    position: "absolute"
  },
  snackbarContent: {
    width: 360
  },
  rightAlign: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  logoutButton: {
    color: "white"
  }
});

function generate(element) {
  return [0, 1, 2, 3, 4].map(value =>
    React.cloneElement(element, {
      key: value
    })
  );
}

class HomePage extends React.PureComponent {
  state = {
    mobileOpen: false,
    snackbarOpen: false
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleSnackbarOpen = () => {
    this.setState({ snackbarOpen: true });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { classes, theme } = this.props;
    const { snackbarOpen } = this.state;
    const fabClassName = classNames(
      classes.fab,
      snackbarOpen ? classes.fabMoveUp : classes.fabMoveDown
    );

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.navIconHide}
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Coursewatch
            </Typography>

            <div className={classes.rightAlign}>
              <LogoutButton
                variant="outlined"
                className={classes.logoutButton}
              />
            </div>
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={this.state.mobileOpen}
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

        <Hidden smDown implementation="css">
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

          <header className="App-header">
            {/*<img src={logo} className="App-logo" alt="logo"/>*/}
            <Typography variant="display1" className="App-title">
              Welcome to React
            </Typography>
          </header>

          <Typography variant="subheading" className="App-intro">
            To get started, edit <code>src/containers/HomePage/index.js</code>{" "}
            and save to reload.
          </Typography>

          <List>
            {generate(
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary="Secondary text"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        </main>

        <Button
          variant="fab"
          color="secondary"
          className={fabClassName}
          onClick={this.handleSnackbarOpen}
        >
          <AddIcon />
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={this.handleSnackbarClose}
          SnackbarContentProps={{
            "aria-describedby": "snackbar-fab-message-id",
            className: classes.snackbarContent
          }}
          message={<span id="snackbar-fab-message-id">Archived</span>}
          action={
            <Button
              size="small"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              Undo
            </Button>
          }
          className={classes.snackbar}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(HomePage);
