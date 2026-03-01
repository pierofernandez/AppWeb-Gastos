import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumenCards from '../components/dashboard/ResumenCards';
import GastosChart from '../components/dashboard/GastosChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import DailyLineChart from '../components/dashboard/DailyLineChart';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfMonth, parseISO } from 'date-fns';

export default function Dashboard() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [summaryData, setSummaryData] = useState({ balance: 0, totalIngresos: 0, totalGastos: 0 });
    const [expenseData, setExpenseData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [dailyData, setDailyData] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch User Profile Name (already filtered by user.id)
            const { data: profile } = await supabase
                .from('perfiles')
                .select('nombre')
                .eq('id', user.id)
                .single();

            if (profile) setUserName(profile.nombre);

            // Fetch all movements for this user only
            const { data: movements, error } = await supabase
                .from('movimientos')
                .select('*, categorias(nombre, color)')
                .eq('usuario_id', user.id)
                .order('fecha', { ascending: false });

            if (error) throw error;

            if (!movements) return;

            // --- 0. Date References ---
            const now = new Date();
            const beginningOfMonth = startOfMonth(now);

            // --- 1. Monthly Summary (For ResumenCards) ---
            let ingresosMes = 0;
            let gastosMes = 0;
            let balanceTotal = 0;

            movements.forEach(m => {
                const monto = parseFloat(m.monto);
                const fechaMov = parseISO(m.fecha);

                // Balance is always total
                if (m.tipo === 'ingreso') balanceTotal += monto;
                else balanceTotal -= monto;

                // Monthly stats
                if (fechaMov >= beginningOfMonth) {
                    if (m.tipo === 'ingreso') ingresosMes += monto;
                    else gastosMes += monto;
                }
            });

            setSummaryData({
                balance: balanceTotal,
                totalIngresos: ingresosMes,
                totalGastos: gastosMes
            });

            // --- 2. Recent Transactions (last 5) ---
            setRecentTransactions(movements.slice(0, 5));

            // --- 3. Monthly Gastos by Category ---
            const catMap = {};
            movements
                .filter(m => m.tipo === 'gasto' && parseISO(m.fecha) >= beginningOfMonth)
                .forEach(m => {
                    const catName = m.categorias?.nombre || 'Sin categoría';
                    const catColor = m.categorias?.color || '#cbd5e1';
                    if (!catMap[catName]) {
                        catMap[catName] = { monto: 0, color: catColor };
                    }
                    catMap[catName].monto += parseFloat(m.monto);
                });

            const formattedExpenseData = Object.keys(catMap).map(name => ({
                categoria: name,
                monto: catMap[name].monto,
                fill: catMap[name].color
            }));
            setExpenseData(formattedExpenseData);

            // --- 4. Daily Gasto (Last 7 Days including today) ---
            const dailyStats = [];
            for (let i = 6; i >= 0; i--) {
                const targetDate = subDays(now, i);
                const dStr = format(targetDate, 'yyyy-MM-dd'); // Matches DB format

                const dayGasto = (movements || [])
                    .filter(m => m.tipo === 'gasto' && m.fecha === dStr)
                    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

                dailyStats.push({
                    date: dStr,
                    monto: dayGasto
                });
            }
            setDailyData(dailyStats);

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, fetchDashboardData]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">Hola, {userName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'} </h1>
                <p className="text-muted-foreground mt-1 text-center sm:text-left">
                    Aquí está el resumen de tus finanzas.
                </p>
            </div>

            <ResumenCards data={summaryData} isLoading={isLoading} />

            {/* Una sola fila de 3 columnas para pantallas grandes */}
            <div className="grid gap-4 lg:grid-cols-3">
                <DailyLineChart chartData={dailyData} isLoading={isLoading} />
                <GastosChart chartData={expenseData} isLoading={isLoading} />
                <RecentTransactions transactions={recentTransactions} isLoading={isLoading} />
            </div>
        </div>
    );
}
