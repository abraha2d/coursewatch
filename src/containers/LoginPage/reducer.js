/*
 *
 * Auth reducer
 *
 */

import { fromJS } from "immutable";
import { SET_AUTH, SET_USER } from "./constants";

export const initialState = fromJS({});

function authReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case SET_AUTH:
      newState = newState.set("token", action.payload.token);
      newState = newState.set("user", action.payload.user);
      return newState;
    case SET_USER:
      newState = newState.set("user", action.payload);
      return newState;
    default:
      return state;
  }
}

export default authReducer;
