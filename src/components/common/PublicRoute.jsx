import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookieUtils';
import { ROUTES } from '../../utils/routes';

const PublicRoute = ({ children }) => {
  const authToken = getCookie('authToken');

  if (authToken) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default PublicRoute;

