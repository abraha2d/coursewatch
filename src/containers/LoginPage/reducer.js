/*
 *
 * Auth reducer
 *
 */

import { fromJS } from "immutable";
import { SET_AUTH } from "./constants";

export const initialState = fromJS({});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH:
      let newState = state;
      newState = newState.set("token", action.payload.token);
      newState = newState.set("user", action.payload.user);
      return newState;
    default:
      return state;
  }
}

export default authReducer;
