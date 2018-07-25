/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from "react";

import LogoutButton from "containers/LoginPage/ConnectedLogoutButton";

export function HomePage() {
  return (
    <div>
      <h1>This is HomePage component!</h1>
      <LogoutButton />
    </div>
  );
}

export default HomePage;
