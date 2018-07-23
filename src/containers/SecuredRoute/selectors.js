import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the securedRoute state domain
 */

const selectSecuredRouteDomain = state =>
  state.get("securedRoute", initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SecuredRoute
 */

const makeSelectSecuredRoute = () =>
  createSelector(selectSecuredRouteDomain, substate => substate.toJS());

export default makeSelectSecuredRoute;
export { selectSecuredRouteDomain };
