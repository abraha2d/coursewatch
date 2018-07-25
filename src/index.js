import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router/immutable";
import createHistory from "history/createBrowserHistory";

import App from "containers/App";
import configureStore from "./configureStore";
import registerServiceWorker from "./registerServiceWorker";

import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Create redux store with history
const initialState = {};
const history = createHistory({
  basename: "/coursewatch/"
});
const store = configureStore(initialState, history);

const theme = createMuiTheme();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <CssBaseline>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </CssBaseline>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();

if (module.hot) {
  module.hot.accept("containers/App", () => {
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <CssBaseline>
            <App />
          </CssBaseline>
        </ConnectedRouter>
      </Provider>,
      document.getElementById("root")
    );
  });
}
