import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function RecentTransactions({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <Card className="col-span-1 border-border shadow-sm">
                <CardHeader>
                    <Skeleton className="h-5 w-[180px] mb-2" />
                    <Skeleton className="h-4 w-[220px]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-1">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-3 w-[80px]" />
                                </div>
                                <div className="ml-auto">
                                    <Skeleton className="h-4 w-[60px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 border-border shadow-sm">
            <CardHeader>
                <CardTitle>Últimos Movimientos</CardTitle>
                <CardDescription>
                    Tus actividades recientes de este mes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {transactions.map((t) => (
                        <div key={t.id} className="flex items-center">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.tipo === 'ingreso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                                }`}>
                                <div className="h-4 w-4 uppercase font-bold text-xs">
                                    {(t.categorias?.nombre || 'O').charAt(0)}
                                </div>
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{t.descripcion}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t.categorias?.nombre || 'Sin categoría'} • {t.fecha}
                                </p>
                            </div>
                            <div className={`ml-auto font-medium ${t.tipo === 'ingreso' ? 'text-emerald-500' : 'text-foreground'
                                }`}>
                                {t.tipo === 'ingreso' ? '+' : '-'} S/{t.monto.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
