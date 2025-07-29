// frontend/src/components/OrganizerRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// We assume you have an AuthContext that provides user info and loading status.
// You created this in the "Build a multi-role authentication system" step.
import { useAuth } from '../../../frontend/src/context/AuthContext'; // Adjust path if necessary

import { useContext } from 'react';
export const useAuth = () => useContext(AuthContext);
const OrganizerRoute = () => {
  // 1. Get the authenticated user and loading status from your context.
  const { user, loading } = useAuth();

  // 2. Handle the loading state.
  // While the auth context is verifying the user (e.g., on page refresh),
  // we don't want to render anything or make a premature decision.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // 3. The authorization check.
  // Once loading is complete, we check if a user exists AND if their role is 'organizer'.
  if (user && user.role === 'organizer') {
    // If they are an authenticated organizer, we render the child components.
    // The `<Outlet />` component from react-router-dom will render the nested route
    // (e.g., the OrganizerDashboardPage).
    return <Outlet />;
  } else {
    // 4. If the user is not an organizer (or not logged in), we redirect them.
    // The `<Navigate>` component redirects to a specified path.
    // `replace` is used to prevent the user from clicking the "back" button
    // and re-accessing this protected route.
    return <Navigate to="/login" replace />;
  }
};

export default OrganizerRoute;