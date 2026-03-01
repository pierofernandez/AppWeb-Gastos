import React, { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../ui/chart'
import { Skeleton } from '../ui/skeleton'

const chartConfig = {
    monto: {
        label: 'Monto',
    }
}

export default function GastosChart({ chartData, isLoading }) {
    const totalGastos = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.monto, 0)
    }, [chartData])

    if (isLoading) {
        return (
            <Card className="flex flex-col col-span-1 border-border shadow-sm">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-5 w-[140px] mb-2" />
                    <Skeleton className="h-4 w-[160px]" />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col col-span-1 border-border shadow-sm">
            <CardHeader className="items-center pb-0">
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Resumen del mes actual</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="monto"
                            nameKey="categoria"
                            innerRadius={60}
                            strokeWidth={5}
                            stroke="hsl(var(--card))"
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    S/{totalGastos.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Gastos Totales
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
