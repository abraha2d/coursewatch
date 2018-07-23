/*
 * LoginPage
 */

import React from "react";
import LoginDialog from "components/LoginDialog";

export default class HomePage extends React.PureComponent {
  handleLogin = token => {
    console.log(token);
  };

  render() {
    return (
      <LoginDialog
        apiAccessToken={process.env.REACT_APP_API_MASTER_KEY}
        onLogin={this.handleLogin}
      />
    );
  }
}
