/*
 *
 * Auth actions
 *
 */

import { SET_AUTH, SET_USER } from "./constants";

export function setAuth(response) {
  return {
    type: SET_AUTH,
    payload: response
  };
}

export function setUser(response) {
  return {
    type: SET_USER,
    payload: response
  };
}
