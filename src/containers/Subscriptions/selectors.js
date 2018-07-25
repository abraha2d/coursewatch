import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the subscriptions state domain
 */

const selectSubscriptionsDomain = state =>
  state.get("subscriptions", initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Subscriptions
 */

const makeSelectSubscriptions = () =>
  createSelector(selectSubscriptionsDomain, substate => substate.toJS());

export default makeSelectSubscriptions;
export { selectSubscriptionsDomain };
