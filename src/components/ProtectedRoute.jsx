import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Si no hay usuario logueado, redirigir al login
        return <Navigate to="/login" replace />;
    }

    // Renderizar las rutas protegidas (Outlet)
    return <Outlet />;
}
