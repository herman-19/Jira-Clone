import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useAuth';

const PrivateRoute = () => {
    let auth = useAuth();
    return auth.loggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;