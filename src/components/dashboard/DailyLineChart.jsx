import React, { useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import { Skeleton } from "../ui/skeleton"

// Mock data for daily comparison (Este mes vs Mes pasado)
const chartData = [
    { day: "01", actual: 120, pasado: 80 },
    { day: "05", actual: 45, pasado: 150 },
    { day: "10", actual: 230, pasado: 100 },
    { day: "15", actual: 80, pasado: 90 },
    { day: "20", actual: 350, pasado: 200 },
    { day: "25", actual: 90, pasado: 110 },
    { day: "30", actual: 300, pasado: 250 },
]

const chartConfig = {
    monto: {
        label: "Gasto",
        color: "hsl(var(--chart-1))",
    }
}

export default function DailyLineChart({ chartData = [], isLoading }) {
    if (isLoading) {
        return (
            <Card className="flex flex-col col-span-1 border-border shadow-sm">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        <Skeleton className="h-4 w-[120px] mb-2" />
                        <Skeleton className="h-3 w-[150px]" />
                    </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:p-6 flex-1">
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        );
    }

    const total = chartData.reduce((acc, curr) => acc + curr.monto, 0);

    return (
        <Card className="flex flex-col col-span-1 border-border shadow-sm">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-base">Gasto Diario</CardTitle>
                    <CardDescription>
                        Visualiza tus gastos en el tiempo
                    </CardDescription>
                </div>
                <div className="flex flex-col justify-center px-6 py-2 border-l border-border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Total Periodo</span>
                    <span className="text-lg font-bold leading-none">S/{total.toLocaleString()}</span>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:p-6 flex-1">
                {chartData.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
                        No hay datos para mostrar.
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[200px] w-full"
                    >
                        <LineChart
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 10,
                            }}
                        >
                            <CartesianGrid vertical={false} stroke="hsl(var(--muted)/0.2)" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickFormatter={(value) => value.split('-')[2]}
                            />
                            <ChartTooltip
                                cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }}
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px] border-border bg-card"
                                        nameKey="monto"
                                        labelFormatter={(value) => {
                                            return `Fecha: ${value}`
                                        }}
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="monto"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={3}
                                dot={{ r: 3, fill: 'hsl(var(--chart-1))', strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
