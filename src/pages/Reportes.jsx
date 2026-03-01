import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../components/ui/pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import {
    DownloadCloud,
    TrendingUp,
    TrendingDown,
    Info,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "../lib/utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Reportes() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [periodo, setPeriodo] = useState('este_mes');
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const [movements, setMovements] = useState([]);
    const [filteredMovements, setFilteredMovements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [balanceData, setBalanceData] = useState([]);
    const [stats, setStats] = useState({
        maxGasto: { mes: '-', monto: 0 },
        maxRentable: { mes: '-', monto: 0 },
        insight: ''
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('movimientos')
                .select('*, categorias(nombre, color)')
                .order('fecha', { ascending: false });

            if (error) throw error;
            setMovements(data || []);
        } catch (error) {
            console.error('Error fetching reports data:', error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los datos de los reportes.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Manejar cambios de periodo rápido
    useEffect(() => {
        const today = new Date();
        let from = date.from;
        let to = date.to;

        if (periodo === 'este_mes') {
            from = startOfMonth(today);
            to = endOfMonth(today);
        } else if (periodo === 'trimestre') {
            from = subDays(today, 90);
            to = today;
        } else if (periodo === 'este_ano') {
            from = startOfYear(today);
            to = endOfYear(today);
        }

        if (periodo !== 'custom') {
            setDate({ from, to });
        }
    }, [periodo]);

    // Filtrar y Procesar Datos
    useEffect(() => {
        if (!movements.length) return;

        const filtered = movements.filter(m => {
            const mDate = parseISO(m.fecha);
            return isWithinInterval(mDate, { start: date.from, end: date.to });
        });

        setFilteredMovements(filtered);
        processChartData(filtered);
        processStats(filtered);
        setCurrentPage(1); // Reset a primera página al filtrar
    }, [movements, date]);

    const processChartData = (data) => {
        // Agrupar por mes para el gráfico de barras
        const monthsMap = {};
        const daysMap = {};

        data.forEach(m => {
            const mDate = parseISO(m.fecha);
            const monthName = format(mDate, 'MMM', { locale: es });
            const dayLabel = format(mDate, 'dd', { locale: es });

            // Mensual
            if (!monthsMap[monthName]) monthsMap[monthName] = { name: monthName, ingresos: 0, gastos: 0 };
            if (m.tipo === 'ingreso') monthsMap[monthName].ingresos += parseFloat(m.monto);
            else monthsMap[monthName].gastos += parseFloat(m.monto);

            // Diario (para el balance)
            if (!daysMap[dayLabel]) daysMap[dayLabel] = 0;
            if (m.tipo === 'ingreso') daysMap[dayLabel] += parseFloat(m.monto);
            else daysMap[dayLabel] -= parseFloat(m.monto);
        });

        setChartData(Object.values(monthsMap));

        // Evolución de Balance
        let currentBalance = 0;
        const evolution = Object.keys(daysMap).sort().map(day => {
            currentBalance += daysMap[day];
            return { day, balance: currentBalance };
        });
        setBalanceData(evolution);
    };

    const processStats = (data) => {
        if (!data.length) return;

        const monthlyGastos = {};
        const monthlyIngresos = {};

        data.forEach(m => {
            const month = format(parseISO(m.fecha), 'MMMM', { locale: es });
            if (m.tipo === 'gasto') {
                monthlyGastos[month] = (monthlyGastos[month] || 0) + parseFloat(m.monto);
            } else {
                monthlyIngresos[month] = (monthlyIngresos[month] || 0) + parseFloat(m.monto);
            }
        });

        let maxG = { mes: '-', monto: 0 };
        Object.entries(monthlyGastos).forEach(([mes, monto]) => {
            if (monto > maxG.monto) maxG = { mes, monto };
        });

        let maxI = { mes: '-', monto: 0 };
        Object.entries(monthlyIngresos).forEach(([mes, monto]) => {
            if (monto > maxI.monto) maxI = { mes, monto };
        });

        // Insight simple
        const totalIngresos = data.filter(m => m.tipo === 'ingreso').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
        const totalGastos = data.filter(m => m.tipo === 'gasto').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
        const diff = totalIngresos - totalGastos;

        let insightText = '';
        if (diff > 0) {
            insightText = `¡Buen trabajo! Has ahorrado ${formatCurrency(diff)} en este periodo seleccionado.`;
        } else if (diff < 0) {
            insightText = `Tus gastos superan a tus ingresos por ${formatCurrency(Math.abs(diff))}. Intenta reducir gastos variables.`;
        } else {
            insightText = "Tus cuentas están equilibradas. Considera empezar un plan de ahorro.";
        }

        setStats({ maxGasto: maxG, maxRentable: maxI, insight: insightText });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto"];
        const tableRows = [];

        filteredMovements.forEach(m => {
            const movementData = [
                format(parseISO(m.fecha), 'dd/MM/yyyy'),
                m.descripcion,
                m.categorias?.nombre || 'Sin categoría',
                m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
                formatCurrency(m.monto)
            ];
            tableRows.push(movementData);
        });

        // Título del PDF
        doc.setFontSize(18);
        doc.text("Reporte de Movimientos - App Gastos", 14, 22);

        // Rango de fechas
        doc.setFontSize(11);
        doc.setTextColor(100);
        const dateRange = date?.from && date?.to
            ? `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
            : "Todo el historial";
        doc.text(`Periodo: ${dateRange}`, 14, 30);

        // Totales rápidos
        const totalIngresos = filteredMovements.filter(m => m.tipo === 'ingreso').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
        const totalGastos = filteredMovements.filter(m => m.tipo === 'gasto').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Ingresos: ${formatCurrency(totalIngresos)}`, 14, 40);
        doc.text(`Total Gastos: ${formatCurrency(totalGastos)}`, 14, 46);
        doc.text(`Balance: ${formatCurrency(totalIngresos - totalGastos)}`, 14, 52);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] } // Emerald 600
        });

        doc.save(`reporte_movimientos_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);

        toast({
            title: "PDF Generado",
            description: "El reporte se ha descargado correctamente."
        });
    };

    const exportToExcel = () => {
        const dataForExcel = filteredMovements.map(m => ({
            Fecha: format(parseISO(m.fecha), 'dd/MM/yyyy'),
            Descripción: m.descripcion,
            Categoría: m.categorias?.nombre || 'Sin categoría',
            Tipo: m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
            Monto: parseFloat(m.monto),
            Moneda: 'PEN'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");

        // Guardar archivo
        XLSX.writeFile(workbook, `reporte_gastos_${format(new Date(), 'ddMMyyyy_HHmm')}.xlsx`);

        toast({
            title: "Excel Generado",
            description: "El reporte se ha descargado correctamente."
        });
    };

    // Lógica de Paginación
    const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
    const paginatedItems = filteredMovements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-center lg:text-left">Reportes Financieros</h1>
                    <p className="text-muted-foreground mt-1 text-center lg:text-left">Analiza tu comportamiento económico con datos reales.</p>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center w-full lg:w-auto">
                    {/* Filtros */}
                    <div className="flex flex-col lg:flex-row gap-2 w-full lg:flex-1">
                        <Select value={periodo} onValueChange={setPeriodo}>
                            <SelectTrigger className="w-full lg:w-[140px]">
                                <SelectValue placeholder="Periodo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="este_mes">Este Mes</SelectItem>
                                <SelectItem value="trimestre">90 Días</SelectItem>
                                <SelectItem value="este_ano">Este Año</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full lg:w-[220px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "dd LLL", { locale: es })} -{" "}
                                                {format(date.to, "dd LLL", { locale: es })}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Seleccionar fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={(newDate) => {
                                        if (newDate) {
                                            setDate(newDate);
                                            setPeriodo('custom');
                                        }
                                    }}
                                    numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
                                    locale={es}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Exportación */}
                    <div className="grid grid-cols-2 lg:flex gap-2 w-full lg:w-auto">
                        <Button variant="outline" onClick={exportToPDF} disabled={filteredMovements.length === 0} className="w-full lg:w-auto">
                            <DownloadCloud className="w-4 h-4 mr-2" />
                            PDF
                        </Button>

                        <Button variant="outline" onClick={exportToExcel} disabled={filteredMovements.length === 0} className="w-full lg:w-auto">
                            <Search className="w-4 h-4 mr-2" />
                            Excel
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-20" />
                            <CardContent className="h-10" />
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mayor Gasto Mensual</CardTitle>
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive capitalize">{stats.maxGasto.mes}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    -{formatCurrency(stats.maxGasto.monto)} gastado
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mes Más Rentable</CardTitle>
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-500 capitalize">{stats.maxRentable.mes}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +{formatCurrency(stats.maxRentable.monto)} generado
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-primary">Análisis IA</CardTitle>
                                <Info className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium mt-1 leading-relaxed">
                                    {stats.insight}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Flujo de Caja Mensual</CardTitle>
                                <CardDescription>Comparativa entre Ingresos y Gastos.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                                            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#888888" />
                                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#888888" tickFormatter={(value) => `S/${value}`} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                            <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">Sin datos en este rango.</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Evolución del Balance</CardTitle>
                                <CardDescription>Tendencia diaria de tu dinero.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {balanceData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={balanceData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                                            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#888888" />
                                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#888888" tickFormatter={(value) => `S/${value}`} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                formatter={(value) => [formatCurrency(value), 'Balance']}
                                            />
                                            <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">Sin datos en este rango.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Detalle de Movimientos</CardTitle>
                                <CardDescription>Listado completo filtrado por fecha.</CardDescription>
                            </div>
                            <div className="text-sm font-medium">
                                Mostrando {paginatedItems.length} de {filteredMovements.length}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                {/* Vista de Tabla para Escritorio */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Descripción</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead className="text-right">Monto</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedItems.length > 0 ? (
                                                paginatedItems.map((m) => (
                                                    <TableRow key={m.id}>
                                                        <TableCell className="text-xs">
                                                            {format(parseISO(m.fecha), 'dd/MM/yyyy')}
                                                        </TableCell>
                                                        <TableCell className="font-medium text-xs">{m.descripcion}</TableCell>
                                                        <TableCell>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted border border-border">
                                                                {m.categorias?.nombre || 'Sin categoría'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={cn(
                                                            "text-right font-bold text-xs",
                                                            m.tipo === 'ingreso' ? "text-emerald-500" : "text-destructive"
                                                        )}>
                                                            {m.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(m.monto)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                        No se encontraron movimientos.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Vista de Tarjetas para Móvil y Tablet Portrait */}
                                <div className="lg:hidden divide-y divide-border overflow-hidden rounded-md">
                                    {paginatedItems.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground bg-background">
                                            No se encontraron movimientos en este periodo.
                                        </div>
                                    ) : (
                                        paginatedItems.map((m) => (
                                            <div key={m.id} className="p-4 space-y-2 hover:bg-muted/50 transition-colors bg-background">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                            {format(parseISO(m.fecha), "eeee, d 'de' MMMM", { locale: es })}
                                                        </span>
                                                        <h4 className="font-bold text-sm leading-tight">{m.descripcion}</h4>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted border border-border whitespace-nowrap">
                                                            {m.categorias?.nombre || 'General'}
                                                        </span>
                                                        <span className={cn(
                                                            "inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-black tracking-tighter uppercase whitespace-nowrap",
                                                            m.tipo === 'ingreso' ? "text-emerald-600" : "text-destructive"
                                                        )}>
                                                            {m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-2">
                                                    <div className={cn(
                                                        "text-lg font-black",
                                                        m.tipo === 'ingreso' ? "text-emerald-600" : "text-destructive"
                                                    )}>
                                                        {m.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(m.monto)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-4">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                                                />
                                            </PaginationItem>

                                            {/* Paginación simplificada */}
                                            <PaginationItem>
                                                <span className="px-4 text-sm">
                                                    Página {currentPage} de {totalPages}
                                                </span>
                                            </PaginationItem>

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
