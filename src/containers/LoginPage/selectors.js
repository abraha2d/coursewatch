import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the loginPage state domain
 */

const selectAuthDomain = state => state.get("auth", initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectAuth = () =>
  createSelector(selectAuthDomain, substate => substate.toJS());

export default makeSelectAuth;
export { selectAuthDomain };
