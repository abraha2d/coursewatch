/**
 * Container Generator
 */

const componentExists = require("../utils/componentExists");

module.exports = {
  description: "Add a container component",
  prompts: [
    {
      type: "list",
      name: "type",
      message: "Select the base component type:",
      default: "Stateless Function",
      choices: () => [
        "Stateless Function",
        "React.PureComponent",
        "React.Component"
      ]
    },
    {
      type: "input",
      name: "name",
      message: "What should it be called?",
      default: "Form",
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? "A component or container with this name already exists"
            : true;
        }

        return "The name is required";
      }
    },
    {
      type: "confirm",
      name: "wantActionsAndReducer",
      default: true,
      message:
        "Do you want an actions/constants/selectors/reducer tuple for this container?"
    },
    {
      type: "confirm",
      name: "wantSaga",
      default: true,
      message: "Do you want sagas for asynchronous flows? (e.g. fetching data)"
    }
  ],
  actions: data => {
    // Generate index.js and index.test.js
    var componentTemplate; // eslint-disable-line no-var

    switch (data.type) {
      case "Stateless Function": {
        componentTemplate = "./container/stateless.js.hbs";
        break;
      }
      default: {
        componentTemplate = "./container/class.js.hbs";
      }
    }

    const actions = [
      {
        type: "add",
        path: "../../src/containers/{{properCase name}}/index.js",
        templateFile: componentTemplate,
        abortOnFail: true
      }
    ];

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: "add",
        path: "../../src/containers/{{properCase name}}/actions.js",
        templateFile: "./container/actions.js.hbs",
        abortOnFail: true
      });

      // Constants
      actions.push({
        type: "add",
        path: "../../src/containers/{{properCase name}}/constants.js",
        templateFile: "./container/constants.js.hbs",
        abortOnFail: true
      });

      // Selectors
      actions.push({
        type: "add",
        path: "../../src/containers/{{properCase name}}/selectors.js",
        templateFile: "./container/selectors.js.hbs",
        abortOnFail: true
      });

      // Reducer
      actions.push({
        type: "add",
        path: "../../src/containers/{{properCase name}}/reducer.js",
        templateFile: "./container/reducer.js.hbs",
        abortOnFail: true
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: "add",
        path: "../../src/containers/{{properCase name}}/saga.js",
        templateFile: "./container/saga.js.hbs",
        abortOnFail: true
      });
    }

    actions.push({
      type: "prettify",
      path: "/containers/"
    });

    return actions;
  }
};
