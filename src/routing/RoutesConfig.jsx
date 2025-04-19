import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from './ProtectedRoutes'

import PortalLayout from '../pages/layouts/PortalLayout'
import CenterScreenLayout from '../pages/layouts/CenterScreenLayout'

import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import Projects from '../pages/Projects'
import Members from '../pages/Members'
import Clients from '../pages/Clients'

const routesConfig = [
  {
    element: <CenterScreenLayout />,
    children: [
      { path: "/auth/signup", element: <SignUp /> },
      { path: "/auth/signin", element: <SignIn /> }
    ]
  },
  {
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/api/projects", element: <Projects /> },
      { path: "/api/members", element: <AdminRoute><Members /></AdminRoute> },
      { path: "/api/clients", element: <AdminRoute><Clients /></AdminRoute> },
      { path: "*", element: <Navigate to="/api/projects" replace /> }
    ]
  },

]

export default routesConfig;