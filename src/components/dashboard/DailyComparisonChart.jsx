import React, { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"

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
    actual: {
        label: "Este Mes",
        color: "hsl(var(--chart-1))",
    },
    pasado: {
        label: "Mes Pasado",
        color: "hsl(var(--chart-2))",
    },
}

export default function DailyComparisonChart() {
    const [activeChart, setActiveChart] = useState("actual")

    return (
        <Card className="col-span-1 lg:col-span-7">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Comparativa de Gastos</CardTitle>
                    <CardDescription>
                        Tus gastos diarios de este mes frente al mes anterior.
                    </CardDescription>
                </div>
                <div className="flex">
                    {["actual", "pasado"].map((key) => {
                        const chart = key;
                        const total = chartData.reduce((acc, curr) => acc + curr[chart], 0)
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total.toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="day"
                                    labelFormatter={(value) => {
                                        return `Día ${value}`
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
