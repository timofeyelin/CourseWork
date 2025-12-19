import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const RoleRoute = ({ allowedRoles = [], element }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return element;
};

export default RoleRoute;
