import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function ResumenCards({ data, isLoading }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[120px] mb-2" />
                            <Skeleton className="h-3 w-[80px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Balance Actual</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.balance)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Tu saldo disponible
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                    <div className="rounded-full bg-emerald-500/10 p-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.totalIngresos)}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
                        Ingresado este mes
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
                    <div className="rounded-full bg-destructive/10 p-1">
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data.totalGastos)}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-destructive">
                        Consumo este mes
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
