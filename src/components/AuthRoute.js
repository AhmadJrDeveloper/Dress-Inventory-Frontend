// AuthRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRoute = ({ element: Component, ...rest }) => {
  const authToken = Cookies.get('token');

  // If the user has a valid token, render the component
  if (authToken) {
    return <Route {...rest} element={<Component />} />;
  }

  // If no token, redirect to the sign-in page
  return <Navigate to="/signIn" />;
};

export default AuthRoute;
