import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { currentUser } = useSelector((state) => state.authentication);
    const isAdmin = currentUser && currentUser?.roles?.includes("ROLE_ADMIN");

    if (publicPage) {
        return currentUser ? <Navigate to="/" /> : <Outlet />
    }

    if (adminOnly) {
        if (!isAdmin) {
            return <Navigate to="/"/>
        }
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute