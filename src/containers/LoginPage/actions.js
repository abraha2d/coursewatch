/*
 *
 * Auth actions
 *
 */

import { SET_AUTH } from "./constants";

export function setAuth(response) {
  return {
    type: SET_AUTH,
    payload: response
  };
}
