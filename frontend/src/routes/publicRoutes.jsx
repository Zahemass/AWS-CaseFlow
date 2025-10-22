import React from 'react';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import { ROUTE_PATHS } from '../constants/routeConstants';

const publicRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: <NotFoundPage />,
  },
];

export default publicRoutes;
