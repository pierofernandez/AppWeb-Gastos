import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ProtectedRoute from '../components/ProtectedRoute';
import Ingresos from '../pages/Ingresos';
import Categorias from '../pages/Categorias';
import Reportes from '../pages/Reportes';
import Configuracion from '../pages/Configuracion';
import Sugerencias from '../pages/Sugerencias';
import Soporte from '../pages/Soporte';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Rutas Privadas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/gastos" element={<Expenses />} />
                        <Route path="/ingresos" element={<Ingresos />} />
                        <Route path="/categorias" element={<Categorias />} />
                        <Route path="/reportes" element={<Reportes />} />
                        <Route path="/configuracion" element={<Configuracion />} />
                        <Route path="/sugerencias" element={<Sugerencias />} />
                        <Route path="/soporte" element={<Soporte />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
